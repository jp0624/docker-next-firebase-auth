'use client'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
export default function ProtectedRoute({children}: {children: ReactNode; path?: string}) {
  const {user, loading} = useAuth(); const router = useRouter()
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading) return <p className="loading-state" role="status">Checking your session…</p>
  return user ? children : <p className="loading-state" role="status">Taking you to sign in…</p>
}
