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

export function useVisitor() {
  const [visitorName, setVisitorNameState] = useState<string>('')
  const [visitorToken] = useState(getOrCreateToken)

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY)
    if (stored) setVisitorNameState(stored)
  }, [])

  const setVisitorName = (name: string) => {
    localStorage.setItem(NAME_KEY, name)
    setVisitorNameState(name)
  }

  return { visitorName, visitorToken, setVisitorName }
}
