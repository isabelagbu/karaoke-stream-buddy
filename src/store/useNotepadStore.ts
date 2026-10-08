import { create } from 'zustand'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { NotepadEntry } from '../types'

interface NotepadState {
  entries: NotepadEntry[]
  loading: boolean
  subscribe: () => () => void
  addEntry: (text: string) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

const notepadCollection = db ? collection(db, 'notepadEntries') : null

export const useNotepadStore = create<NotepadState>((set) => ({
  entries: [],
  loading: true,
  subscribe: () => {
    if (!notepadCollection) {
      set({ loading: false })
      return () => {}
    }
    const q = query(notepadCollection, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          text: data.text,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } satisfies NotepadEntry
      })
      set({ entries, loading: false })
    })
  },
  addEntry: async (text) => {
    if (!notepadCollection) return
    await addDoc(notepadCollection, { text, createdAt: serverTimestamp() })
  },
  deleteEntry: async (id) => {
    if (!notepadCollection) return
    await deleteDoc(doc(notepadCollection, id))
  },
}))
