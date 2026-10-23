import Link from 'next/link'
import { Fingerprint } from 'lucide-react'
import Nav from './Nav'
export default function Header() { return <header className="site-header"><Link className="brand" href="/" aria-label="Auth Starter home"><span className="brand-icon"><Fingerprint size={23}/></span><span>auth<span className="brand-light">starter</span><span className="brand-dot">.</span></span></Link><Nav /></header> }
