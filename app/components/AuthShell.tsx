import Link from 'next/link'
import { ArrowLeft, Fingerprint, Check } from 'lucide-react'
import type { ReactNode } from 'react'
export default function AuthShell({title, description, children}: {title: string; description: string; children: ReactNode}) {
 return <section className="auth-layout"><aside className="auth-story"><Link href="/" className="back-link"><ArrowLeft size={16}/> Back to the beginning</Link><div><Fingerprint size={46} strokeWidth={1.2}/><h2>A familiar face.<br/>A space of your own.</h2><p>A considered account experience, from your first hello to your next visit.</p><ul><li><Check size={16}/> Clear, accessible account forms</li><li><Check size={16}/> Session-aware personal workspace</li><li><Check size={16}/> A demo you can explore freely</li></ul></div><span className="mono">AUTHENTICATION STARTER / JOHN PARKER</span></aside><div className="auth-form-panel"><p className="eyebrow">YOUR NEXT STEP</p><h1>{title}</h1><p className="form-intro">{description}</p>{children}</div></section>
}
