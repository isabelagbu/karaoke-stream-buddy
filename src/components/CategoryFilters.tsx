import { useMemo } from 'react'
import { useSongsStore } from '../store/useSongsStore'
import { useFiltersStore } from '../store/useFiltersStore'

export function CategoryFilters() {
  const songs = useSongsStore((s) => s.songs)
  const { selectedArtists, showDisney, showMusicalTheatre, toggleArtist, toggleDisney, toggleMusicalTheatre, clear } =
    useFiltersStore()

  const artists = useMemo(
    () => Array.from(new Set(songs.map((s) => s.artist).filter(Boolean))).sort(),
    [songs],
  )

  return (
    <div className="rounded-lg bg-neutral-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-300">Categories</h3>
        <button onClick={clear} className="text-xs text-neutral-500 hover:text-neutral-300">
          Clear
        </button>
      </div>

      <div className="mb-3 space-y-1">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input type="checkbox" checked={showDisney} onChange={toggleDisney} />
          Disney songs
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input type="checkbox" checked={showMusicalTheatre} onChange={toggleMusicalTheatre} />
          Musical theatre
        </label>
      </div>

      {artists.length > 0 && (
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Artist</p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {artists.map((artist) => (
              <label key={artist} className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={selectedArtists.has(artist)}
                  onChange={() => toggleArtist(artist)}
                />
                {artist}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
