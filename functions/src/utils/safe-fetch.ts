import { lookup } from 'node:dns/promises'
import ipaddr from 'ipaddr.js'

export const FETCH_TIMEOUT_MS = 8000
const MAX_REDIRECTS = 5

/**
 * True only for a normal public unicast address. Everything else — loopback,
 * private, link-local (incl. cloud metadata), unique-local, CGNAT, reserved,
 * 6to4/teredo, etc. — is treated as non-public. Uses ipaddr.js for range
 * classification instead of hand-rolled parsing.
 */
export function isPublicAddress(ip: string): boolean {
  let addr: ipaddr.IPv4 | ipaddr.IPv6
  try {
    addr = ipaddr.parse(ip)
  } catch {
    return false
  }
  // Unwrap IPv4-mapped IPv6 (::ffff:a.b.c.d) so the embedded v4 is classified.
  if (addr.kind() === 'ipv6' && (addr as ipaddr.IPv6).isIPv4MappedAddress()) {
    addr = (addr as ipaddr.IPv6).toIPv4Address()
  }
  return addr.range() === 'unicast'
}

/** Rejects non-http(s) URLs and hosts that resolve to a private/internal IP. */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Unsupported protocol')
  }

  const results = await lookup(url.hostname, { all: true })
  if (results.length === 0 || results.some((r) => !isPublicAddress(r.address))) {
    throw new Error('Blocked host')
  }

  return url
}

/**
 * fetch() wrapper hardened against SSRF: validates the target (and every
 * redirect hop) against the public-address allowlist before connecting.
 */
export async function safeFetch(rawUrl: string, init: RequestInit = {}): Promise<Response> {
  let target = rawUrl
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicUrl(target)

    const response = await fetch(target, {
      ...init,
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (response.status < 300 || response.status >= 400) {
      return response
    }

    const location = response.headers.get('location')
    if (!location) return response
    target = new URL(location, target).toString()
  }

  throw new Error('Too many redirects')
}
