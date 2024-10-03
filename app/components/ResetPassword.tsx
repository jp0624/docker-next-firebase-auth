'use client'
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
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '@/services/authContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { INTERIOR_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import Link from 'next/link'

const ResetPassword = () => {
	const auth = getAuth()
	const { user } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)
	const [emailSent, setEmailSent] = useState<boolean | null>(false)

	const formSchema = z.object({
		email: z.string().email({ message: 'Please enter a valid email address.' }),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log('values: ', values)
		if (loading) return
		setLoading(true)
		sendPasswordResetEmail(auth, values.email)
			.then(() => {})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				console.log('errorCode: ', errorCode)
				console.log('errorMessage: ', errorMessage)
				setLoading(false)
			})
			.finally(() => {
				setLoading(false)
				setEmailSent(true)
			})
	}

	return (
		<>
			<h1 className='text-3xl font-bold mb-2 text-left w-2/3 lg:w-1/3'>
				Reset Password
			</h1>

			<Form {...form}>
				{!emailSent && (
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 flex flex-col flex-items-center justify-center align-center w-2/3 lg:w-1/3'
					>
						{loading && <p>Loading...</p>}
						{!loading && (
							<>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<Input
													type='email'
													placeholder='Email Address'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit' disabled={loading}>
									Reset Password
								</Button>
							</>
						)}
					</form>
				)}
				{emailSent && (
					<p className='text-sm pt-2'>
						A password reset email has been sent to {form.getValues('email')}
						<Link href={LOGIN_ROUTE}>
							<span className='underline px-2'>Log In</span>
						</Link>
					</p>
				)}
			</Form>
		</>
	)
}

export default ResetPassword
