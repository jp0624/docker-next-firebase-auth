'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth'
import { db } from '@/services/firebase'
import { auth } from './firebase'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'

// User data type interface
interface UserType {
	email: string | null
	uid: string | null
}

// Create auth context
const AuthContext = createContext({})

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<any>(AuthContext)

// Create the auth context provider
export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	// Define the constants for the user and loading state
	const [loading, setLoading] = useState<Boolean>(true)
	const [user, setUser] = useState<UserType>({ email: null, uid: null })
	const [userData, setUserData] = useState({}) // Separate user document state

	// Update the state depending on auth
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({
					email: user.email,
					uid: user.uid,
				})
				setUserData({})
			} else {
				setUser({ email: null, uid: null })
			}
		})

		setLoading(false)

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		if (!user?.uid) return

		const userRef = collection(db, 'users', user.uid, 'data')
		const unsubscribe = onSnapshot(userRef, (snapshot) => {
			let userData = {}
			snapshot.forEach((doc) => {
				console.log(`doc: `, doc.data())
				userData = { ...doc.data() }
			})

			setUserData(userData)
			console.log('Updated userData: ', userData)
		})

		return () => unsubscribe()
	}, [user])

	const signUp = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password)
	}

	// Login the user
	const logIn = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password)
	}

	// Update the user and data in the db
	const updateUser = (userData: {}) => {
		if (!user?.uid) return
		const userRef = collection(db, 'users', user.uid, 'data')
		addDoc(userRef, userData)
		return userData
		console.log('Updated userData: ', userData)
	}

	// Logout the user
	const logOut = async () => {
		setUser({ email: null, uid: null })
		return await signOut(auth)
	}

	// Wrap the children with the context provider
	return (
		<AuthContext.Provider
			value={{ user, signUp, logIn, logOut, userData, updateUser }}
		>
			{loading ? null : children}
		</AuthContext.Provider>
	)
}
