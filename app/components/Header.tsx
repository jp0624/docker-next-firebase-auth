'use client'
import Link from 'next/link'
import Nav from './Nav'
import { HOME_ROUTE } from '@/constants/routes'

const Header = () => {
	return (
		<>
			<header className='flex items-center justify-between h-100px w-full p-2 md:p-5 gap-2 border-b-2 bg-slate-100'>
				<Link href={HOME_ROUTE}>
					<div className='flex items-left w-full justify-between flex-col ml-5 md:ml-10'>
						<h1 className='text-2xl md:text-3xl font-bold whitespace-nowrap'>
							Auth Example
						</h1>
						<p className='text-xs md:text-sm'>Docker + Next.js + Firebase</p>
						<p className='text-xs md:text-sm'>FireStore + Tailwind + Shadcn</p>
					</div>
				</Link>
				<Nav />
			</header>
		</>
	)
}

export default Header
