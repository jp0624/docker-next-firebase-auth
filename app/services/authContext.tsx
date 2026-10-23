'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User } from 'firebase/auth'
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { getFirebaseServices } from './firebase'
import { authError } from '@/lib/auth-errors'

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
    return onAuthStateChanged(auth, u => { setRealUser(u ? session(u) : null); setLoading(false) }, () => { setLoading(false); setNotice('Account services are unavailable. The demo is still available.') })
  }, [])
  useEffect(() => {
    setProfile(EMPTY); setNotice('')
    if (!realUser?.uid || isDemo) return
    const { db } = getFirebaseServices()
    return onSnapshot(doc(db, 'users', realUser.uid), snapshot => {
      const p = snapshot.data()
      setProfile({first_name: p?.first_name || '', last_name: p?.last_name || '', display_name: p?.display_name || realUser.displayName || ''})
    }, error => setNotice(authError(error)))
  }, [realUser?.uid, realUser?.displayName, isDemo])
  function saveDemo(p: Profile | null) { setDemoProfile(p); try { if (p) sessionStorage.setItem(DEMO_KEY, JSON.stringify(p)); else sessionStorage.removeItem(DEMO_KEY) } catch { /* State remains usable without storage. */ } }
  async function logIn(email: string, password: string) {
    const { auth } = getFirebaseServices(); const result = await signInWithEmailAndPassword(auth, email, password)
    setRealUser(session(result.user)); saveDemo(null)
  }
  async function signUp(email: string, password: string, p: Profile) {
    const { auth, db } = getFirebaseServices(); const { user } = await createUserWithEmailAndPassword(auth, email, password)
    setRealUser(session(user)); saveDemo(null)
    try { await updateProfile(user, {displayName: p.display_name}); await setDoc(doc(db, 'users', user.uid), {...p, uid: user.uid, createdAt: serverTimestamp()}); setProfile(p) }
    catch(error) { setNotice(authError(error)) }
  }
  async function googleSignIn() {
    const { auth, db } = getFirebaseServices(); const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
    setRealUser(session(user)); saveDemo(null)
    try { const ref = doc(db, 'users', user.uid); if (!(await getDoc(ref)).exists()) await setDoc(ref, {...EMPTY, display_name: user.displayName || '', uid: user.uid, createdAt: serverTimestamp()}) }
    catch(error) { setNotice(authError(error)) }
  }
  async function logOut() {
    if (demoProfile) { saveDemo(null); return }
    await signOut(getFirebaseServices().auth); setRealUser(null); setProfile(EMPTY)
  }
  async function updateUser(p: Profile) {
    if (demoProfile) { saveDemo(p); return }
    const { auth, db } = getFirebaseServices(); if (!auth.currentUser) throw new Error('Sign in required')
    await setDoc(doc(db, 'users', auth.currentUser.uid), p, {merge: true}); await updateProfile(auth.currentUser, {displayName: p.display_name}); setProfile(p)
  }
  const value: AuthState = { user: demoProfile ? {uid: 'demo-preview', email: 'alex@example.com', displayName: demoProfile.display_name, emailVerified: false, provider: 'demo'} : realUser,
    userData: demoProfile || profile, loading, isDemo: !!demoProfile, notice: demoProfile ? '' : notice,
    enterDemo: () => saveDemo({...DEMO}), logIn, signUp, googleSignIn, logOut, updateUser,
    resetPassword: email => sendPasswordResetEmail(getFirebaseServices().auth, email) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
