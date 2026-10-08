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
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { NewSong, Song } from '../types'

interface SongsState {
  songs: Song[]
  loading: boolean
  subscribe: () => () => void
  addSong: (song: NewSong) => Promise<void>
  updateSong: (id: string, updates: Partial<NewSong>) => Promise<void>
  deleteSong: (id: string) => Promise<void>
}

const songsCollection = db ? collection(db, 'songs') : null

export const useSongsStore = create<SongsState>((set) => ({
  songs: [],
  loading: true,
  subscribe: () => {
    if (!songsCollection) {
      set({ loading: false })
      return () => {}
    }
    const q = query(songsCollection, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const songs = snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          title: data.title,
          artist: data.artist,
          youtubeUrl: data.youtubeUrl,
          youtubeId: data.youtubeId,
          isDisney: data.isDisney,
          isMusicalTheatre: data.isMusicalTheatre,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } satisfies Song
      })
      set({ songs, loading: false })
    })
  },
  addSong: async (song) => {
    if (!songsCollection) return
    await addDoc(songsCollection, { ...song, createdAt: serverTimestamp() })
  },
  updateSong: async (id, updates) => {
    if (!songsCollection) return
    await updateDoc(doc(songsCollection, id), updates)
  },
  deleteSong: async (id) => {
    if (!songsCollection) return
    await deleteDoc(doc(songsCollection, id))
  },
}))
