import { useState } from 'react'
import { useSongsStore } from '../store/useSongsStore'
import { extractYouTubeId } from '../lib/youtube'

export function AddSongForm() {
  const addSong = useSongsStore((s) => s.addSong)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isDisney, setIsDisney] = useState(false)
  const [isMusicalTheatre, setIsMusicalTheatre] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) {
      setError('Could not find a valid YouTube video ID in that URL.')
      return
    }
    setError(null)
    setSubmitting(true)
    await addSong({ title, artist, youtubeUrl, youtubeId, isDisney, isMusicalTheatre })
    setTitle('')
    setArtist('')
    setYoutubeUrl('')
    setIsDisney(false)
    setIsMusicalTheatre(false)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-neutral-900 p-4">
      <h3 className="text-sm font-semibold text-neutral-300">Add a song</h3>
      <input
        required
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="w-full rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        required
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="w-full rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input type="checkbox" checked={isDisney} onChange={(e) => setIsDisney(e.target.checked)} />
          Disney
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            checked={isMusicalTheatre}
            onChange={(e) => setIsMusicalTheatre(e.target.checked)}
          />
          Musical theatre
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {submitting ? 'Adding…' : 'Add song'}
      </button>
    </form>
  )
}
