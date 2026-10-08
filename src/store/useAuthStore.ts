import { create } from 'zustand'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, firebaseConfigured } from '../firebase'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const googleProvider = new GoogleAuthProvider()

export const useAuthStore = create<AuthState>((set) => {
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })
  }

  return {
    user: null,
    loading: firebaseConfigured,
    error: null,
    loginWithGoogle: async () => {
      if (!auth) {
        set({ error: 'Firebase is not configured yet — see README.md.' })
        return
      }
      set({ error: null })
      try {
        await signInWithPopup(auth, googleProvider)
      } catch {
        set({ error: 'Google sign-in failed. Please try again.' })
      }
    },
    logout: async () => {
      if (!auth) return
      await signOut(auth)
    },
    clearError: () => set({ error: null }),
  }
})
