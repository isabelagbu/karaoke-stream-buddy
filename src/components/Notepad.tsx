import { useState } from 'react'
import { useNotepadStore } from '../store/useNotepadStore'
import { useAuthStore } from '../store/useAuthStore'
import { OWNER_EMAIL } from '../config'

export function Notepad() {
  const entries = useNotepadStore((s) => s.entries)
  const loading = useNotepadStore((s) => s.loading)
  const addEntry = useNotepadStore((s) => s.addEntry)
  const deleteEntry = useNotepadStore((s) => s.deleteEntry)
  const user = useAuthStore((s) => s.user)
  const isOwner = user?.email === OWNER_EMAIL
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    await addEntry(text.trim())
    setText('')
    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-neutral-500">
        Jot down song ideas here to look up and add to your library later.
      </p>

      {isOwner && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            placeholder="New song idea to look up…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}

      <div className="rounded-lg bg-neutral-900">
        {loading && <p className="p-4 text-sm text-neutral-500">Loading notes…</p>}
        {!loading && entries.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">No notes yet.</p>
        )}
        <ul className="divide-y divide-neutral-800">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 p-3">
              <span className="text-sm text-neutral-100">{entry.text}</span>
              {isOwner && (
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400 hover:bg-red-600 hover:text-white"
                  aria-label="Delete note"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
