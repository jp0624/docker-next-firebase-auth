'use client'

import ProtectedRoute from '@/components/ProtectedRoutes'
import { useAuth } from '@/services/authContext'

const InteriorPage = () => {
	const { user, userData } = useAuth()
	return (
		<>
			<ProtectedRoute path={'/interior'}>
				<div>
					{userData?.first_name && (
						<>
							Welcome back, {userData?.first_name} {userData?.last_name}!
						</>
					)}
				</div>
			</ProtectedRoute>
		</>
	)
}

export default InteriorPage
