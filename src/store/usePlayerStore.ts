import { create } from 'zustand'
import type { Song } from '../types'

interface PlayerState {
  nowPlaying: Song | null
  play: (song: Song) => void
  clear: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  nowPlaying: null,
  play: (song) => set({ nowPlaying: song }),
  clear: () => set({ nowPlaying: null }),
}))
