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
import { auth, db } from '@/services/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { INTERIOR_ROUTE } from '@/constants/routes'

const PASSWORD_VALIDATION = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&,.#/<>?;':=_+])[A-Za-z\d#@$!%*?&,./<>?;':=_+]{8,}$/
)
const EMAIL_VALIDATION = new RegExp(
	/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
)
// const MAX_UPLOAD_SIZE = 10 * 1024 * 1024
// const ACCEPTED_FILE_TYPES = [
// 	'image/jpeg',
// 	'image/jpg',
// 	'image/png',
// 	'image/webp',
// ]

const formSchema = z
	.object({
		email: z
			.string()
			.trim()
			.min(8, { message: 'Must have at least 8 characters' })
			.regex(EMAIL_VALIDATION, {
				message: 'Please enter a valid email address.',
			})
			.email({ message: 'Please enter a valid email address.' }),
		password: z
			.string()
			.trim()
			.min(1, { message: 'Must have at least 1 character' })
			.regex(PASSWORD_VALIDATION, {
				message:
					"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one of these special character '!@#$%^&*?'.",
			}),
		confirm_password: z.string().trim().min(1, 'Please fill out this field'),
		first_name: z.string().trim().min(1, 'Please fill out this field'),
		last_name: z.string().trim().min(1, 'Please fill out this field'),
		// picture: z
		// 	.any()
		// 	.refine((files) => {
		// 		return files?.[0]?.size <= MAX_UPLOAD_SIZE
		// 	}, `Max image size is 5MB.`)
		// 	.refine(
		// 		(files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
		// 		'Only .jpg, .jpeg, .png and .webp formats are supported.'
		// 	),
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords do not match',
				path: ['confirm_password'],
			})
		}
	})

const RegisterForm = () => {
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)
	const [errorcode, setErrorcode] = useState<string | null>(null)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			confirm_password: '',
			first_name: '',
			last_name: '',
			// picture: '',
		},
	})
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log('values: ', values)
		if (loading) return
		setErrorcode(null)
		setLoading(true)
		createUserWithEmailAndPassword(
			auth,
			form.getValues('email'),
			form.getValues('password')
		)
			.then(async ({ user }) => {
				console.log('user: ', user)

				// Signed in
				const uid = user.uid
				console.log('uid: ', uid)

				// Save to Firestore
				let userObj = {
					email: user.email,
					uid: user.uid,
					first_name: form.getValues('first_name'),
					last_name: form.getValues('last_name'),
					createdAt: new Date(),
				}
				const userRef = collection(db, 'users', uid, 'data')
				try {
					await addDoc(userRef, userObj)
				} catch (e) {
					console.error('Error adding document: ', e)
				} finally {
					router.push(INTERIOR_ROUTE)
				}

				// ...
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				errorCode === 'auth/email-already-in-use' &&
					setErrorcode('Email already in use')
				console.log('errorCode: ', errorCode)
				console.log('errorMessage: ', errorMessage)
				setLoading(false)
			})
	}
	return (
		<>
			<h1 className='text-3xl font-bold mb-2 text-left w-2/3 lg:w-1/3'>
				Register Form
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 flex flex-col flex-items-center justify-center align-center w-2/3 lg:w-1/3'
				>
					<p className='text-sm pt-2 text-right'>
						<em className='text-red-500'>*</em> Represents Required Fields
					</p>
					{errorcode && <p className='text-red-500 text-center'>{errorcode}</p>}
					{loading && <p>Loading...</p>}
					{!loading && (
						<>
							<FormField
								control={form.control}
								name='first_name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<em className='text-red-500'>*</em> First Name
										</FormLabel>
										<FormControl>
											<Input type='text' placeholder='First Name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='last_name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<em className='text-red-500'>*</em> Last Name
										</FormLabel>
										<FormControl>
											<Input type='text' placeholder='Last Name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <FormField
								control={form.control}
								name='picture'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Profile Picture</FormLabel>
										<FormControl>
											<Input
												type='file'
												placeholder='Profile Picture'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<em className='text-red-500'>*</em> Email Address
										</FormLabel>
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
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<em className='text-red-500'>*</em> Password
										</FormLabel>
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
							<FormField
								control={form.control}
								name='confirm_password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<em className='text-red-500'>*</em> Confirm Password
										</FormLabel>
										<FormControl>
											<PasswordInput
												id='confirm_password'
												autoComplete='confirm-password'
												required={true}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit'>Sign Up</Button>
						</>
					)}
				</form>
			</Form>
		</>
	)
}

export default RegisterForm
