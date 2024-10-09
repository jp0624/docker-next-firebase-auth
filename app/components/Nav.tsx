'use client'

import { LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from '@/constants/routes'
import Link from 'next/link'
import SignOutButton from './ui/signout-button'
import { auth } from '@/services/firebase'
import { useAuth } from '@/services/authContext'

const Nav = () => {
	const { user } = useAuth()
	return (
		<>
			<ul className='flex justify-between gap-5 pr-5 md:pr-10 text-sm'>
				{auth.currentUser ? (
					<>
						<Link href={PROFILE_ROUTE}>
							<li>Profile</li>
						</Link>
						<li>
							<SignOutButton />
						</li>
					</>
				) : (
					<>
						<Link href={LOGIN_ROUTE}>
							<li>Login</li>
						</Link>
						<Link href={REGISTER_ROUTE}>Register</Link>
					</>
				)}
			</ul>
		</>
	)
}

export default Nav
