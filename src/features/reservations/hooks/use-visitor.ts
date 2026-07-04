import { useEffect, useState } from 'react'

const NAME_KEY = 'regalitos_visitor_name'
const TOKEN_KEY = 'regalitos_visitor_token'

function getOrCreateToken(): string {
  const stored = localStorage.getItem(TOKEN_KEY)
  if (stored) return stored
  const token = crypto.randomUUID()
  localStorage.setItem(TOKEN_KEY, token)
  return token
}

/** Current token without creating one — used by the transfer/import flow. */
export function getStoredVisitorToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Replaces this device's identity with a token brought from another device. */
export function importVisitorToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

/** SHA-256 (hex) — matches the digest the Cloud Functions store on the gift. */
async function sha256Hex(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function useVisitor() {
  const [visitorName, setVisitorNameState] = useState<string>('')
  const [visitorToken] = useState(getOrCreateToken)
  const [visitorTokenHash, setVisitorTokenHash] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY)
    if (stored) setVisitorNameState(stored)
  }, [])

  useEffect(() => {
    let active = true
    sha256Hex(visitorToken).then((hash) => {
      if (active) setVisitorTokenHash(hash)
    })
    return () => {
      active = false
    }
  }, [visitorToken])

  const setVisitorName = (name: string) => {
    localStorage.setItem(NAME_KEY, name)
    setVisitorNameState(name)
  }

  return { visitorName, visitorToken, visitorTokenHash, setVisitorName }
}
