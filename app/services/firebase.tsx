// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: 'AIzaSyB9cUxN0ZKmBbkOElD7S_0kZMz8tqhebD8',
	authDomain: 'docker-next-firebase-auth.firebaseapp.com',
	projectId: 'docker-next-firebase-auth',
	storageBucket: 'docker-next-firebase-auth.appspot.com',
	messagingSenderId: '761780253134',
	appId: '1:761780253134:web:3132feb0160762f0f9fb9f',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
