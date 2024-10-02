'use client'

import { INTERIOR_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { useRouter } from 'next/navigation'
import { useAuth } from './services/authContext'
import { useState } from 'react'

const LoginPage = () => {
	const [loading, setLoading] = useState(true)
	const { user, userData } = useAuth()
	const router = useRouter()
	setTimeout(() => {
		setLoading(false)
	}, 500)
	return (
		<>
			{loading && <p>Loading...</p>}
			{!loading && userData?.uid ? (
				<>{userData?.uid && router.push(INTERIOR_ROUTE)}</>
			) : (
				<>{!userData?.uid && router.push(LOGIN_ROUTE)}</>
			)}
		</>
	)
}

export default LoginPage
