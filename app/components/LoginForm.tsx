'use client'

import { PasswordInput } from '@/components/ui/password-input'
import { Button } from './ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { auth, db } from '@/services/firebase'
import {
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	INTERIOR_ROUTE,
	REGISTER_ROUTE,
	RESET_PASSWORD_ROUTE,
} from '@/constants/routes'
import Link from 'next/link'
import { Chrome, GoalIcon } from 'lucide-react'
import Google from 'next-auth/providers/google'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'

const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z.string().trim().min(1, 'Please fill out this field'),
})
const LoginForm = () => {
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)
	const [errorcode, setErrorcode] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log('values: ', values)
		if (loading) return
		setLoading(true)
		setErrorcode(null)
		signInWithEmailAndPassword(auth, values.email, values.password)
			.then(({ user }) => {
				router.push(INTERIOR_ROUTE)
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				errorCode === 'auth/invalid-credential' &&
					setErrorcode('Incorrect email or password')
				errorCode === 'auth/wrong-password' &&
					setErrorcode('Incorrect password')
				console.log('errorCode: ', errorCode)
				console.log('errorMessage: ', errorMessage)
				setLoading(false)
			})
	}
	const signUpGoogle = () => {
		const provider = new GoogleAuthProvider()

		signInWithPopup(auth, provider)
			.then(async ({ user }) => {
				console.log('user: ', user)

				// Save to Firestore
				let userObj = {
					email: user.email,
					uid: user.uid,
					display_name: user.displayName,
					createdAt: new Date(),
				}
				const userRef = collection(db, 'users', user.uid, 'data')
				try {
					await addDoc(userRef, userObj)
					router.push(INTERIOR_ROUTE)
				} catch (e) {
					console.error('Error adding document: ', e)
				}
				try {
					// await addDoc(userRef, userObj)
					await setDoc(doc(db, 'users', user.uid), {
						email: user.email,
						uid: user.uid,
						first_name: '',
						last_name: '',
						display_name: user.displayName,
						createdAt: new Date(),
					})
					router.push(INTERIOR_ROUTE)
				} catch (e) {
					console.error('Error adding document: ', e)
				}
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				errorCode === 'auth/invalid-credential' &&
					setErrorcode('Incorrect email or password')

				console.log('errorCode: ', errorCode)
				console.log('errorMessage: ', errorMessage)
			})
	}
	return (
		<>
			<h1 className='text-3xl font-bold mb-2 text-left w-2/3 lg:w-1/3'>
				Login Form
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 flex flex-col flex-items-center justify-center align-center w-2/3 lg:w-1/3'
				>
					{errorcode && <p className='text-red-500'>{errorcode}</p>}
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<Input type='email' placeholder='Email Address' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput
										id='password'
										autoComplete='password'
										required={true}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' disabled={loading}>
						Log In
					</Button>
				</form>
				<p className='text-sm w-full text-center !mt-1'>or</p>
				<Button className='!mt-3 px-10' onClick={signUpGoogle}>
					<Chrome className='w-4 h-4 mr-2' /> Sign in with Google
				</Button>
				<p className='text-sm pt-5'>
					Don't have an account?
					<Link href={REGISTER_ROUTE}>
						<span className='underline px-2'>Register Here</span>
					</Link>
				</p>
				<p className='text-sm pt-2'>
					Trouble logging into your account?
					<Link href={RESET_PASSWORD_ROUTE}>
						<span className='underline px-2'>Reset Password</span>
					</Link>
				</p>
			</Form>
		</>
	)
}

export default LoginForm
