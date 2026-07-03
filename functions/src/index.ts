import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import { initializeApp } from 'firebase-admin/app'

import { extractMetadata, EMPTY_METADATA } from './utils/metadata.js'

initializeApp()

export { reserveGift, cancelReservation, markGiftBought } from './reservations.js'
export { addCoAdmin } from './co-admins.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const extractUrlMetadata = functions.https.onRequest(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set(CORS_HEADERS)
    res.status(204).send('')
    return
  }

  res.set(CORS_HEADERS)

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
