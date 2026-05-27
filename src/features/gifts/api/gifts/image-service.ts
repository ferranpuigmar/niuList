import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { storage } from '../../../../lib/firebase'

export async function uploadGiftImage(listId: string, giftId: string, file: File) {
  const storageRef = ref(storage, `lists/${listId}/gifts/${giftId}/${file.name}`)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}
