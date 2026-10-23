'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/services/authContext'
import SignOutButton from './ui/signout-button'
export default function Nav() {
 const {user, loading} = useAuth(); const path = usePathname()
 return <nav aria-label="Main navigation"><Link href="/#how-it-works">How it works</Link>{!loading && user ? <><Link href="/interior" aria-current={path === '/interior' ? 'page' : undefined}>Workspace</Link><Link href="/profile" aria-current={path === '/profile' ? 'page' : undefined}>Profile</Link><SignOutButton /></> : <><Link href="/login">Sign in</Link><Link className="nav-cta" href="/register">Get started <span aria-hidden="true">↗</span></Link></>}</nav>
}
