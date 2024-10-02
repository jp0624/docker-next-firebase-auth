'use client'

import { useAuth } from '@/services/authContext'

const Footer = () => {
	const { user } = useAuth()
	return (
		<footer className='w-full text-xs border-t-2 bg-slate-100 p-2'>
			<span>uid: {user && user.uid}</span>
		</footer>
	)
}

export default Footer
