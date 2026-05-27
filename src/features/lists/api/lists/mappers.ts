import type { DocumentData, DocumentSnapshot } from 'firebase/firestore'

import type { List } from '../../types/list-type'

export function mapListSnapshot(snapshot: DocumentSnapshot<DocumentData>): List {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    babyName: data?.babyName,
    emoji: data?.emoji,
    welcomeMessage: data?.welcomeMessage,
    adminIds: data?.adminIds ?? [],
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  }
}
