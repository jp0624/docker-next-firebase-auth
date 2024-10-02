'use client'

import { INTERIOR_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { useRouter } from 'next/navigation'
import { useAuth } from './services/authContext'

const LoginPage = () => {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<>
			{user.uid && router.push(INTERIOR_ROUTE)}
			{!user.uid && router.push(LOGIN_ROUTE)}
		</>
	)
}

export default LoginPage
