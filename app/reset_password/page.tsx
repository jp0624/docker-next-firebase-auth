'use client'
import { INTERIOR_ROUTE } from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'
import ResetPassword from '@/components/ResetPassword'

const ResetPasswordPage = () => {
	const router = useRouter()
	const { user } = useAuth()

	return <>{user.uid ? router.push(INTERIOR_ROUTE) : <ResetPassword />}</>
}

export default ResetPasswordPage
