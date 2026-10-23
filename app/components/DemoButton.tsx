'use client'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'
export default function DemoButton({className = 'button secondary'}: {className?: string}) {
  const {enterDemo, loading} = useAuth(); const router = useRouter()
  return <button className={className} disabled={loading} onClick={() => {enterDemo(); router.push('/interior')}}>Explore the demo <span aria-hidden="true">↗</span></button>
}
