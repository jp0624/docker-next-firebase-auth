import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase web configuration is public; authorization is enforced by Firebase rules.
// Environment overrides let deployments use their own Firebase project.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB9cUxN0ZKmBbkOElD7S_0kZMz8tqhebD8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'docker-next-firebase-auth.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'docker-next-firebase-auth',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:761780253134:web:3132feb0160762f0f9fb9f',
}
export function getFirebaseServices() {
  const app = getApps().length ? getApp() : initializeApp(config)
  return { auth: getAuth(app), db: getFirestore(app) }
}
