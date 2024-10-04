'use client'
import RegisterForm from '@/components/RegisterForm'
import { INTERIOR_ROUTE } from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
	const router = useRouter()
	const { user } = useAuth()

	return <>{user.uid ? router.push(INTERIOR_ROUTE) : <RegisterForm />}</>
}

export default RegisterPage
