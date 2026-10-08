import { create } from 'zustand'

interface FiltersState {
  selectedArtists: Set<string>
  showDisney: boolean
  showMusicalTheatre: boolean
  toggleArtist: (artist: string) => void
  toggleDisney: () => void
  toggleMusicalTheatre: () => void
  clear: () => void
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  selectedArtists: new Set(),
  showDisney: false,
  showMusicalTheatre: false,
  toggleArtist: (artist) => {
    const next = new Set(get().selectedArtists)
    if (next.has(artist)) next.delete(artist)
    else next.add(artist)
    set({ selectedArtists: next })
  },
  toggleDisney: () => set({ showDisney: !get().showDisney }),
  toggleMusicalTheatre: () => set({ showMusicalTheatre: !get().showMusicalTheatre }),
  clear: () => set({ selectedArtists: new Set(), showDisney: false, showMusicalTheatre: false }),
}))

export function hasActiveFilters(filters: {
  selectedArtists: Set<string>
  showDisney: boolean
  showMusicalTheatre: boolean
}) {
  return filters.selectedArtists.size > 0 || filters.showDisney || filters.showMusicalTheatre
}

export function songMatchesFilters(
  song: { artist: string; isDisney: boolean; isMusicalTheatre: boolean },
  filters: { selectedArtists: Set<string>; showDisney: boolean; showMusicalTheatre: boolean },
) {
  if (!hasActiveFilters(filters)) return true
  if (filters.selectedArtists.has(song.artist)) return true
  if (filters.showDisney && song.isDisney) return true
  if (filters.showMusicalTheatre && song.isMusicalTheatre) return true
  return false
}
