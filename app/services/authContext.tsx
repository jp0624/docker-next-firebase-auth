'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User } from 'firebase/auth'
import { getFirebaseServices } from './firebase'

export interface Profile { first_name: string; last_name: string; display_name: string }
interface SessionUser { uid: string; email: string | null; displayName: string | null; emailVerified: boolean; provider: string }
interface AuthState {
  user: SessionUser | null; userData: Profile; loading: boolean; isDemo: boolean; notice: string;
  enterDemo: () => void; logOut: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: Profile) => Promise<void>;
  googleSignIn: () => Promise<void>; resetPassword: (email: string) => Promise<void>;
  updateUser: (profile: Profile) => Promise<void>;
}
const EMPTY: Profile = { first_name: '', last_name: '', display_name: '' }
const DEMO: Profile = { first_name: 'Alex', last_name: 'Morgan', display_name: 'Alex Morgan' }
const DEMO_KEY = 'authentication-starter-demo-v1'
const AuthContext = createContext<AuthState | null>(null)
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('Auth provider is missing'); return value }
const accountProfile = (displayName: string | null): Profile => { const name = (displayName || '').trim(); const [first_name = '', ...rest] = name.split(/\s+/); return { first_name, last_name: rest.join(' '), display_name: name } }
const session = (u: User): SessionUser => ({ uid: u.uid, email: u.email, displayName: u.displayName, emailVerified: u.emailVerified, provider: u.providerData[0]?.providerId || 'password' })
export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [realUser, setRealUser] = useState<SessionUser | null>(null)
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [demoProfile, setDemoProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const isDemo = demoProfile !== null
  useEffect(() => {
    try { const saved = sessionStorage.getItem(DEMO_KEY); if (saved) { const p = JSON.parse(saved); if (typeof p.first_name === 'string' && typeof p.last_name === 'string' && typeof p.display_name === 'string') setDemoProfile(p) } } catch { /* A blocked storage API still permits an in-memory demo. */ }
    const { auth } = getFirebaseServices()
    return onAuthStateChanged(auth, u => { setRealUser(u ? session(u) : null); setProfile(accountProfile(u?.displayName || null)); setLoading(false) }, () => { setLoading(false); setNotice('Account services are unavailable. The demo is still available.') })
  }, [])
  function saveDemo(p: Profile | null) { setDemoProfile(p); try { if (p) sessionStorage.setItem(DEMO_KEY, JSON.stringify(p)); else sessionStorage.removeItem(DEMO_KEY) } catch { /* State remains usable without storage. */ } }
  async function logIn(email: string, password: string) {
    const { auth } = getFirebaseServices(); const result = await signInWithEmailAndPassword(auth, email, password)
    setRealUser(session(result.user)); setProfile(accountProfile(result.user.displayName)); saveDemo(null)
  }
  async function signUp(email: string, password: string, p: Profile) {
    const { auth } = getFirebaseServices(); const { user } = await createUserWithEmailAndPassword(auth, email, password)
    // Authentication owns the account name; no document database or profile rules are required.
    await updateProfile(user, {displayName: p.display_name.slice(0,100)})
    setRealUser(session(user)); setProfile(accountProfile(user.displayName)); saveDemo(null)
  }
  async function googleSignIn() {
    const { auth } = getFirebaseServices(); const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
    setRealUser(session(user)); setProfile(accountProfile(user.displayName)); saveDemo(null)
  }
  async function logOut() {
    if (demoProfile) { saveDemo(null); return }
    await signOut(getFirebaseServices().auth); setRealUser(null); setProfile(EMPTY)
  }
  async function updateUser(p: Profile) {
    const name = p.display_name.trim(); if (!name || name.length > 100) throw new Error('A display name of 1–100 characters is required')
    const next = accountProfile(name)
    if (demoProfile) { saveDemo(next); return }
    const { auth } = getFirebaseServices(); if (!auth.currentUser) throw new Error('Sign in required')
    await updateProfile(auth.currentUser, {displayName: name})
    setRealUser(session(auth.currentUser)); setProfile(next)
  }
  const value: AuthState = { user: demoProfile ? {uid: 'demo-preview', email: 'alex@example.com', displayName: demoProfile.display_name, emailVerified: false, provider: 'demo'} : realUser,
    userData: demoProfile || profile, loading, isDemo: !!demoProfile, notice: demoProfile ? '' : notice,
    enterDemo: () => saveDemo({...DEMO}), logIn, signUp, googleSignIn, logOut, updateUser,
    resetPassword: email => sendPasswordResetEmail(getFirebaseServices().auth, email) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
