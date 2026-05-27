export function getPublicListUrl(listId: string) {
  return `${window.location.origin}/${listId}`
}

export async function copyShareUrl(listId: string) {
  const url = getPublicListUrl(listId)
  await navigator.clipboard.writeText(url)
  return url
}
