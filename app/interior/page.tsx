'use client'

import ProtectedRoute from '@/components/ProtectedRoutes'
import { Button } from '@/components/ui/button'
import { PROFILE_ROUTE } from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'

const InteriorPage = () => {
	const router = useRouter()
	const { userData } = useAuth()
	return (
		<>
			<ProtectedRoute path={'/interior'}>
				<div>
					{userData?.uid && (
						<>
							<p className='text-center text-xl border-b-2'>
								Welcome back,{' '}
								<em className='font-bold'>
									{userData?.display_name ? (
										<>{userData?.display_name}</>
									) : (
										<>
											{userData?.first_name} {userData?.last_name}!
										</>
									)}
								</em>
							</p>
							<pre className='text-xs p-2'>
								{JSON.stringify(userData, null, 2)}
							</pre>
							<p className='pt-2 w-full'>
								<Button
									className='w-full'
									onClick={() => router.push(PROFILE_ROUTE)}
								>
									View Profile
								</Button>
							</p>
						</>
					)}
				</div>
			</ProtectedRoute>
		</>
	)
}

export default InteriorPage
