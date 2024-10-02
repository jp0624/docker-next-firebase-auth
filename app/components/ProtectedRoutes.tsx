'use client'

import { LOGIN_ROUTE } from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import { set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ProtectedRoute = ({
	children,
	path,
}: {
	children: React.ReactNode
	path: string
}) => {
	const router = useRouter()
	const { user } = useAuth()

	useEffect(() => {
		if (!user.uid) {
			router.push(LOGIN_ROUTE)
		} else {
			router.push(`${path}`)
		}
	}, [router, user])

	return <>{user.uid ? children : null}</>
}

export default ProtectedRoute
