import { useMemo } from 'react'
import { useSongsStore } from '../store/useSongsStore'
import { useFiltersStore, songMatchesFilters } from '../store/useFiltersStore'
import { useAuthStore } from '../store/useAuthStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { OWNER_EMAIL } from '../config'
import { CategoryFilters } from './CategoryFilters'
import { AddSongForm } from './AddSongForm'
import { Player } from './Player'

export function SongLibrary() {
  const songs = useSongsStore((s) => s.songs)
  const loading = useSongsStore((s) => s.loading)
  const deleteSong = useSongsStore((s) => s.deleteSong)
  const filters = useFiltersStore()
  const user = useAuthStore((s) => s.user)
  const isOwner = user?.email === OWNER_EMAIL
  const play = usePlayerStore((s) => s.play)

  const filteredSongs = useMemo(
    () => songs.filter((song) => songMatchesFilters(song, filters)),
    [songs, filters],
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Player />

        <div className="rounded-lg bg-neutral-900">
          {loading && <p className="p-4 text-sm text-neutral-500">Loading songs…</p>}
          {!loading && filteredSongs.length === 0 && (
            <p className="p-4 text-sm text-neutral-500">No songs match your filters yet.</p>
          )}
          <ul className="divide-y divide-neutral-800">
            {filteredSongs.map((song) => (
              <li key={song.id} className="flex items-center justify-between gap-3 p-3">
                <button
                  onClick={() => play(song)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-medium text-neutral-100">{song.title}</p>
                  <p className="text-xs text-neutral-500">
                    {song.artist}
                    {song.isDisney && ' · Disney'}
                    {song.isMusicalTheatre && ' · Musical theatre'}
                  </p>
                </button>
                <button
                  onClick={() => play(song)}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  Play
                </button>
                {isOwner && (
                  <button
                    onClick={() => deleteSong(song.id)}
                    className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400 hover:bg-red-600 hover:text-white"
                    aria-label={`Delete ${song.title}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <CategoryFilters />
        {isOwner && <AddSongForm />}
      </div>
    </div>
  )
}
