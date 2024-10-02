'use client'

import { PasswordInput } from '@/components/ui/password-input'
import { Button } from './ui/button'
import {
	Form,
	FormControl,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { auth } from '@/services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INTERIOR_ROUTE } from '@/constants/routes'

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
			.then(({ user }) => {})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				errorCode === 'auth/invalid-credential' &&
					setErrorcode('Incorrect email or password')
				console.log('errorCode: ', errorCode)
				console.log('errorMessage: ', errorMessage)
				setLoading(false)
			})
			.finally(() => router.push(INTERIOR_ROUTE))
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
									<Input type='email' placeholder='shadcn' {...field} />
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
			</Form>
		</>
	)
}

export default LoginForm
