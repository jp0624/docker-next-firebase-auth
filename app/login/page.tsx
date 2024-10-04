'use client'

import LoginForm from '@/components/LoginForm'
import { INTERIOR_ROUTE } from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
	const router = useRouter()
	const { user } = useAuth()

	return <>{user.uid ? router.push(INTERIOR_ROUTE) : <LoginForm />}</>
}

export default LoginPage
