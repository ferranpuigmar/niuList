// The visitor token travels in the URL *fragment* (#) so it never reaches any
// server, logs or referrers — it only exists in the browser.
export function getTransferUrl(visitorToken: string, listId?: string) {
  const query = listId ? `?lista=${encodeURIComponent(listId)}` : ''
  return `${window.location.origin}/importar${query}#${visitorToken}`
}
