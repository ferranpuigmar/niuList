import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'

import { extractMetadata, EMPTY_METADATA } from './utils/metadata.js'

// `cors: true` lets the 2nd-gen runtime handle preflight/headers, so the app
// (any origin) can POST a product URL and get back its metadata.
export const extractUrlMetadata = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const url = req.body?.url as string | undefined

  if (!url || typeof url !== 'string') {
    res.json(EMPTY_METADATA)
    return
  }

  try {
    const metadata = await extractMetadata(url)
    res.json(metadata)
  } catch (err) {
    logger.warn('Failed to extract metadata', err)
    res.json(EMPTY_METADATA)
  }
})
