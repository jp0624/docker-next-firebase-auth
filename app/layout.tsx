import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthContextProvider } from './services/authContext'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: 'Auth Example',
	description:
		'Generated with Docker + Next.js + Firebase +FireStore + Tailwind + Shadcn',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthContextProvider>
			<html lang='en'>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased !overflow-y-auto !pr-0 !scroll-smooth`}
				>
					<div className='grid grid-rows-[100px_1fr_35px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]'>
						<Header />
						<main className='flex flex-col row-start-2 items-center w-full py-5'>
							{children}
						</main>
						<Footer />
					</div>
				</body>
			</html>
		</AuthContextProvider>
	)
}
