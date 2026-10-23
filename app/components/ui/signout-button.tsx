'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/services/authContext'
export default function SignOutButton() {
 const {logOut, isDemo} = useAuth(); const router = useRouter(); const [busy,setBusy]=useState(false); const [failed,setFailed]=useState(false)
 return <span><button disabled={busy} onClick={async()=>{setBusy(true);setFailed(false);try{await logOut();router.push('/')}catch{setFailed(true)}finally{setBusy(false)}}}>{busy?'Signing out…':isDemo?'Exit demo':'Sign out'}</button>{failed&&<span role="alert"> Couldn’t sign out. Try again.</span>}</span>
}
