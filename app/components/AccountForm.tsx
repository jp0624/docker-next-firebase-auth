'use client'
import {useEffect, useState, type FormEvent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/services/authContext'
import {authError} from '@/lib/auth-errors'
import {emailSchema, loginSchema, registrationSchema} from '@/lib/validation'
import {PasswordInput} from './ui/password-input'
import AuthShell from './AuthShell'
import DemoButton from './DemoButton'
type Mode = 'login' | 'register' | 'reset'
export default function AccountForm({mode}: {mode: Mode}) {
 const {user,loading,logIn,signUp,googleSignIn,resetPassword}=useAuth(); const router=useRouter()
 const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [sent,setSent]=useState(false); const [fields,setFields]=useState<Record<string,string>>({})
 useEffect(()=>{if(!loading&&user)router.replace('/interior')},[user,loading,router])
 const text=mode==='login'?{title:'Welcome back.',intro:'Good to see you again. Sign in to your workspace.',action:'Sign in'}:mode==='register'?{title:'Make yourself at home.',intro:'Create your account and start with a space of your own.',action:'Create account'}:{title:'Let’s get you back in.',intro:'Enter your account email. We’ll help you reset your password.',action:'Send reset link'}
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();if(busy)return;setError('');setFields({})
  const data=Object.fromEntries(new FormData(event.currentTarget)); const result=mode==='register'?registrationSchema.safeParse(data):mode==='login'?loginSchema.safeParse(data):emailSchema.safeParse(data.email)
  if(!result.success){const errors:Record<string,string>={};result.error.issues.forEach(i=>{const key=String(i.path[0]||'email');if(!errors[key])errors[key]=i.message});setFields(errors);return}
  setBusy(true)
  try{if(mode==='reset'){await resetPassword(String(data.email).trim());setSent(true)}else if(mode==='login'){await logIn(String(data.email).trim(),String(data.password));router.replace('/interior')}else{await signUp(String(data.email).trim(),String(data.password),{first_name:String(data.first_name).trim(),last_name:String(data.last_name).trim(),display_name:`${String(data.first_name).trim()} ${String(data.last_name).trim()}`});router.replace('/interior')}}catch(e){setError(authError(e))}finally{setBusy(false)}
 }
 function field(name:string,label:string,type='text',autocomplete?:string){return <div className="field" key={name}><label htmlFor={name}>{label}</label>{type==='password'?<PasswordInput id={name} name={name} autoComplete={autocomplete} aria-invalid={!!fields[name]} aria-describedby={fields[name]?`${name}-error`:undefined}/>:<input id={name} name={name} type={type} autoComplete={autocomplete} aria-invalid={!!fields[name]} aria-describedby={fields[name]?`${name}-error`:undefined}/ >}{fields[name]&&<p id={`${name}-error`} className="field-error" role="alert">{fields[name]}</p>}</div>}
 return <AuthShell title={text.title} description={text.intro}>{sent?<div className="success-panel" role="status"><h2>Check your inbox.</h2><p>If an account uses that email, you’ll receive a password reset link. Check your spam folder too.</p><Link className="button primary" href="/login">Back to sign in</Link><button className="text-button" onClick={()=>setSent(false)}>Use a different email</button></div>:<><form onSubmit={submit} noValidate className="account-form"><fieldset disabled={busy||loading}>{mode==='register'&&<div className="two-fields">{field('first_name','First name','text','given-name')}{field('last_name','Last name','text','family-name')}</div>}{field('email','Email address','email','email')}{mode!=='reset'&&field('password','Password','password',mode==='login'?'current-password':'new-password')}{mode==='register'&&<><p className="field-help">At least 8 characters, with uppercase and lowercase letters and a number. Spaces are allowed.</p>{field('confirm_password','Confirm password','password','new-password')}</>}{mode==='login'&&<Link className="forgot-link" href="/reset_password">Forgot your password?</Link>}{error&&<p className="error-panel" role="alert">{error}</p>}<button className="button primary full" disabled={busy||loading} type="submit">{busy?'Working…':text.action}<span aria-hidden="true">↗</span></button></fieldset></form>{mode!=='reset'&&<><div className="or-divider"><span/>or<span/></div><button className="button secondary full" disabled={busy||loading} onClick={async()=>{setBusy(true);setError('');try{await googleSignIn();router.replace('/interior')}catch(e){setError(authError(e))}finally{setBusy(false)}}}>Continue with Google</button><p className="form-switch">{mode==='login'?'New here?':'Already have an account?'} <Link href={mode==='login'?'/register':'/login'}>{mode==='login'?'Create an account':'Sign in'}</Link></p><div className="demo-callout"><p>Take a look around first.</p><DemoButton className="text-button"/><span>Sample data only. No account required.</span></div></>}{mode==='reset'&&<Link className="back-link" href="/login">← Back to sign in</Link>}</>}</AuthShell>
}
