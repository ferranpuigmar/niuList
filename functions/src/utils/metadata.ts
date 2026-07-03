import * as cheerio from 'cheerio'

import { safeFetch } from './safe-fetch.js'

export type Metadata = {
  title: string | null
  description: string | null
  imageDataUrl: string | null
}

export const EMPTY_METADATA: Metadata = { title: null, description: null, imageDataUrl: null }

const USER_AGENT = 'Mozilla/5.0 (compatible; RegalitosBot/1.0)'

type ParsedTags = {
  title: string | null
  description: string | null
  imageUrl: string | null
}

/** Reads Open Graph / Twitter / standard tags out of an HTML document. */
export function parseHtmlMetadata(html: string): ParsedTags {
  const $ = cheerio.load(html)

  const title =
    $('meta[property="og:title"]').attr('content') ??
    $('meta[name="og:title"]').attr('content') ??
    $('meta[name="twitter:title"]').attr('content') ??
    ($('title').text().trim() || null)

  const description =
    $('meta[property="og:description"]').attr('content') ??
    $('meta[name="og:description"]').attr('content') ??
    $('meta[name="description"]').attr('content') ??
    $('meta[name="twitter:description"]').attr('content') ??
    null

  const imageUrl =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[name="twitter:image"]').attr('content') ??
    $('meta[name="twitter:image:src"]').attr('content') ??
    $('meta[property="image"]').attr('content') ??
    $('meta[name="image"]').attr('content') ??
    $('meta[name="og:image"]').attr('content') ??
    $('link[rel="image_src"]').attr('href') ??
    null

  return { title: title ?? null, description: description ?? null, imageUrl }
}

/** Downloads an image (SSRF-checked) and returns it as a base64 data URL. */
export async function fetchImageAsDataUrl(
  imageUrl: string,
  baseUrl: string,
): Promise<string | null> {
  try {
    const absoluteUrl = new URL(imageUrl, baseUrl).toString()
    const res = await safeFetch(absoluteUrl)
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) return null

    const buffer = Buffer.from(await res.arrayBuffer())
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    // skip image if download fails or is blocked
    return null
  }
}

/** Fetches a page and extracts title, description and a base64 preview image. */
export async function extractMetadata(url: string): Promise<Metadata> {
  const response = await safeFetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!response.ok) return EMPTY_METADATA

  const html = await response.text()
  const { title, description, imageUrl } = parseHtmlMetadata(html)

  const imageDataUrl = imageUrl
    ? await fetchImageAsDataUrl(imageUrl, response.url || url)
    : null

  return { title, description, imageDataUrl }
}
