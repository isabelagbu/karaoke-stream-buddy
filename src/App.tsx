import { useEffect, useState } from 'react'
import { firebaseConfigured } from './firebase'
import { OWNER_EMAIL } from './config'
import { useAuthStore } from './store/useAuthStore'
import { useSongsStore } from './store/useSongsStore'
import { useNotepadStore } from './store/useNotepadStore'
import { LoginModal } from './components/LoginModal'
import { SongLibrary } from './components/SongLibrary'
import { Notepad } from './components/Notepad'
import { Wheel } from './components/Wheel'
import type { Tab } from './types'

const TABS: { id: Tab; label: string }[] = [
  { id: 'library', label: 'Library' },
  { id: 'notepad', label: 'Notepad' },
  { id: 'wheel', label: 'Wheel' },
]

function App() {
  const { user, logout } = useAuthStore()
  const subscribeSongs = useSongsStore((s) => s.subscribe)
  const subscribeNotepad = useNotepadStore((s) => s.subscribe)
  const [tab, setTab] = useState<Tab>('library')
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const unsubSongs = subscribeSongs()
    const unsubNotepad = subscribeNotepad()
    return () => {
      unsubSongs()
      unsubNotepad()
    }
  }, [subscribeSongs, subscribeNotepad])

  useEffect(() => {
    if (user) setShowLogin(false)
  }, [user])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <h1 className="text-lg font-bold">🎤 Karaoke Stream Buddy</h1>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-400">
              {user.email}
              {user.email !== OWNER_EMAIL && ' (view only)'}
            </span>
            <button
              onClick={() => logout()}
              className="rounded-md bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700"
          >
            Log in
          </button>
        )}
      </header>

      <nav className="flex gap-1 border-b border-neutral-800 px-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border-b-2 border-indigo-500 text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {!firebaseConfigured && (
        <div className="bg-amber-500/10 px-6 py-3 text-sm text-amber-400">
          Firebase isn't configured yet — songs and notes won't be saved. See README.md to connect
          your Firebase project.
        </div>
      )}

      <main className="p-6">
        {tab === 'library' && <SongLibrary />}
        {tab === 'notepad' && <Notepad />}
        {tab === 'wheel' && <Wheel />}
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}

export default App
