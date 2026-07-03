import { createHash } from 'node:crypto'

/**
 * SHA-256 (hex) of a visitor token. Only the hash is ever stored on the gift,
 * so the raw token never leaks through the public reads. Matches the digest
 * the browser computes with Web Crypto (crypto.subtle.digest('SHA-256')).
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
