import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { initializeApp } from 'firebase-admin/app';
import * as cheerio from 'cheerio';
initializeApp();
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
export const extractUrlMetadata = functions.https.onRequest(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.set(CORS_HEADERS);
        res.status(204).send('');
        return;
    }
    res.set(CORS_HEADERS);
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const url = req.body?.url;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        res.json({ title: null, description: null, imageUrl: null });
        return;
    }
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RegalitosBot/1.0)' },
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
            res.json({ title: null, description: null, imageUrl: null });
            return;
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const title = $('meta[property="og:title"]').attr('content') ??
            $('meta[name="og:title"]').attr('content') ??
            $('meta[name="twitter:title"]').attr('content') ??
            $('title').text().trim() ??
            null;
        const description = $('meta[property="og:description"]').attr('content') ??
            $('meta[name="og:description"]').attr('content') ??
            $('meta[name="description"]').attr('content') ??
            $('meta[name="twitter:description"]').attr('content') ??
            null;
        const imageUrl = $('meta[property="og:image"]').attr('content') ??
            $('meta[name="twitter:image"]').attr('content') ??
            $('meta[name="twitter:image:src"]').attr('content') ??
            $('meta[property="image"]').attr('content') ??
            $('meta[name="image"]').attr('content') ??
            $('meta[name="og:image"]').attr('content') ??
            $('link[rel="image_src"]').attr('href') ??
            null;
        let imageDataUrl = null;
        if (imageUrl) {
            try {
                const imgRes = await fetch(imageUrl, {
                    signal: AbortSignal.timeout(8000),
                });
                if (imgRes.ok) {
                    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
                    const buffer = Buffer.from(await imgRes.arrayBuffer());
                    const base64 = buffer.toString('base64');
                    imageDataUrl = `data:${contentType};base64,${base64}`;
                }
            }
            catch {
                // skip image if download fails
            }
        }
        res.json({ title, description, imageDataUrl });
    }
    catch (err) {
        logger.warn('Failed to extract metadata', err);
        res.json({ title: null, description: null, imageUrl: null });
    }
});
