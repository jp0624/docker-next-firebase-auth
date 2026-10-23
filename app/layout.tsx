import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthContextProvider } from './services/authContext'
export const metadata: Metadata = {title: {default: 'Authentication Starter — A better beginning', template: '%s | Authentication Starter'}, description: 'Explore a complete account experience: sign in, registration, password recovery and a personal workspace. Built with Next.js, Firebase and TypeScript.'}
export default function RootLayout({children}: {children: React.ReactNode}) {
 return <html lang="en"><body><AuthContextProvider><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></AuthContextProvider></body></html>
}
