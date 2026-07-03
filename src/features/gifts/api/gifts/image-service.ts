import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { storage } from '../../../../lib/firebase'

export async function uploadGiftImage(listId: string, giftId: string, file: File) {
  // Never trust file.name in the storage path — derive a safe extension and use
  // a random file name to avoid path issues and collisions.
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const fileName = `${crypto.randomUUID()}.${ext}`
  const storageRef = ref(storage, `lists/${listId}/gifts/${giftId}/${fileName}`)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}
