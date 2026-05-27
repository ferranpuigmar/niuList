import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../../../lib/firebase'

type CreateListInput = {
  babyName: string
  emoji?: string
  welcomeMessage: string
  adminIds: string[]
}

export async function createList(input: CreateListInput) {
  const listsRef = collection(db, 'lists')

  return addDoc(listsRef, {
    babyName: input.babyName,
    emoji: input.emoji ?? '',
    welcomeMessage: input.welcomeMessage,
    adminIds: input.adminIds,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getListById(listId: string) {
  const listRef = doc(db, 'lists', listId)
  const snapshot = await getDoc(listRef)
  return snapshot
}

export function getListsByAdminId(uid: string) {
  const listsQuery = query(collection(db, 'lists'), where('adminIds', 'array-contains', uid))
  return getDocs(listsQuery)
}

export function updateListById(
  listId: string,
  input: Partial<Pick<CreateListInput, 'babyName' | 'emoji' | 'welcomeMessage'>>,
) {
  const listRef = doc(db, 'lists', listId)
  return updateDoc(listRef, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export function addCoAdminToList(listId: string, uid: string) {
  const listRef = doc(db, 'lists', listId)
  return updateDoc(listRef, {
    adminIds: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  })
}
