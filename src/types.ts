export interface Song {
  id: string
  title: string
  artist: string
  youtubeUrl: string
  youtubeId: string
  isDisney: boolean
  isMusicalTheatre: boolean
  createdAt: number
}

export type NewSong = Omit<Song, 'id' | 'createdAt'>

export interface NotepadEntry {
  id: string
  text: string
  createdAt: number
}

export type Tab = 'library' | 'notepad' | 'wheel'
