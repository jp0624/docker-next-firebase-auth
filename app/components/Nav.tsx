'use client'

import {
	HOME_ROUTE,
	LOGIN_ROUTE,
	PROFILE_ROUTE,
	REGISTER_ROUTE,
} from '@/constants/routes'
import { useAuth } from '@/services/authContext'
import Link from 'next/link'
import SignOutButton from './ui/signout-button'

const Nav = () => {
	const { user } = useAuth()
	return (
		<>
			<ul className='flex justify-between gap-5 pr-5 md:pr-10 text-sm'>
				{user && user.uid ? (
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
