'use client'

import { INTERIOR_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { useRouter } from 'next/navigation'
import { useAuth } from './services/authContext'

const LoginPage = () => {
	const { user, userData } = useAuth()
	const router = useRouter()
	return <>{router.push(INTERIOR_ROUTE)}</>
}

export default LoginPage
