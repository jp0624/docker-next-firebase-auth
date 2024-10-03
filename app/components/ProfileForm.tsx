'use client'

import { useAuth } from '@/services/authContext'
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
import { updatePassword } from 'firebase/auth'
import { useState } from 'react'
import { Edit, X } from 'lucide-react'
const passwordValidation = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/
)

const profileFormSchema = z.object({
	first_name: z.string().trim().min(1, 'Please fill out this field'),
	last_name: z.string().trim().min(1, 'Please fill out this field'),
})
const emailFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z.string().trim().min(1, 'Please enter your current password'),
})
const passwordFormSchema = z
	.object({
		current_password: z
			.string()
			.trim()
			.min(1, 'Please enter your current password'),
		new_password: z
			.string()
			.trim()
			.min(1, { message: 'Must have at least 1 character' })
			.regex(passwordValidation, {
				message:
					"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one of these special character '!@#$%^&*?'.",
			}),
		confirm_password: z.string().trim().min(1, 'Please fill out this field'),
	})
	.superRefine(({ confirm_password, new_password }, ctx) => {
		if (confirm_password !== new_password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords do not match',
				path: ['confirm_password'],
			})
		}
	})

const ProfileForm = () => {
	const { user, userData, updateUser } = useAuth()
	const [loading, setLoading] = useState<boolean>(false)
	const [editStatus, setEditStatus] = useState<null | string>(null)

	const profileDefaultValues = {
		email: '',
		first_name: '',
		last_name: '',
	}
	const emailDefaultValues = {
		email: '',
		password: '',
	}
	const passwordDefaultValues = {
		new_password: '',
		current_password: '',
		confirm_password: '',
	}
	const profileForm = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: profileDefaultValues,
		mode: 'onChange',
		values: userData,
	})
	const emailForm = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: emailDefaultValues,
		mode: 'onChange',
		values: userData,
	})
	const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: passwordDefaultValues,
	})

	const onSubmitUpdateProfile = (
		profileValues: z.infer<typeof profileFormSchema>
	) => {
		console.log('profileValues: ', profileValues)
		if (loading) return
	}
	const onSubmitUpdateEmail = (
		emailValues: z.infer<typeof emailFormSchema>
	) => {
		console.log('emailValues: ', emailValues)
		if (loading) return
	}
	const onSubmitUpdatePassword = (
		passwordValues: z.infer<typeof passwordFormSchema>
	) => {
		console.log('passwordValues: ', passwordValues)
		if (loading) return
	}

	return (
		<>
			<h1 className='text-3xl pt-2 font-bold  text-left whitespace-nowrap w-2/3 lg:w-1/3'>
				{editStatus === 'profile' ? (
					<Button
						onClick={() => setEditStatus(null)}
						className='bg-red-800 p-1 h-5 w-5'
					>
						<X className=' h-4 w-4' />
					</Button>
				) : (
					<Button
						onClick={() => setEditStatus('profile')}
						className=' p-1 h-5 w-5'
					>
						<Edit className='h-4 w-4' />
					</Button>
				)}{' '}
				Profile Details
			</h1>
			{editStatus !== 'profile' && (
				<ul className='space-y-8 flex flex-col pt-2 w-2/3 lg:w-1/3'>
					<li>First Name: {userData?.first_name}</li>
					<li className='!mt-1 border-t-2'>Last Name: {userData?.last_name}</li>
				</ul>
			)}
			{editStatus === 'profile' && (
				<Form {...profileForm}>
					<form
						onSubmit={profileForm.handleSubmit(onSubmitUpdateProfile)}
						className='space-y-8 flex flex-col pt-2 flex-items-center justify-center align-center w-2/3 lg:w-1/3'
					>
						<FormField
							control={profileForm.control}
							name='first_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input type='text' placeholder='First Name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={profileForm.control}
							name='last_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input
											type='text'
											placeholder='Last Name'
											// value={userData?.last_name}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Update Profile</Button>
					</form>
				</Form>
			)}
			<h1 className='text-3xl pt-5 font-bold  text-left whitespace-nowrap w-2/3 lg:w-1/3'>
				{editStatus === 'email' ? (
					<Button
						onClick={() => setEditStatus(null)}
						className='bg-red-800 p-1 h-5 w-5'
					>
						<X className='h-4 w-4' />
					</Button>
				) : (
					<Button
						onClick={() => setEditStatus('email')}
						className=' p-1 h-5 w-5'
					>
						<Edit className='h-4 w-4' />
					</Button>
				)}{' '}
				Email Address
			</h1>
			{editStatus !== 'email' && (
				<ul className='space-y-8 flex flex-col pt-2 w-2/3 lg:w-1/3'>
					<li>Email Address: {userData?.email}</li>
				</ul>
			)}
			{editStatus === 'email' && (
				<Form {...emailForm}>
					<form
						onSubmit={emailForm.handleSubmit(onSubmitUpdateEmail)}
						className='space-y-8 flex flex-col pt-2 flex-items-center justify-center align-center w-2/3 lg:w-1/3'
					>
						<FormField
							control={emailForm.control}
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
						<FormField
							control={emailForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											id='current_password'
											autoComplete='current-password'
											required={true}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Update Email</Button>
					</form>
				</Form>
			)}

			<h1 className='text-3xl pt-5 font-bold  text-left whitespace-nowrap w-2/3 lg:w-1/3'>
				{editStatus === 'password' ? (
					<Button
						onClick={() => setEditStatus(null)}
						className='bg-red-800 p-1 h-5 w-5'
					>
						<X className='h-4 w-4' />
					</Button>
				) : (
					<Button
						onClick={() => setEditStatus('password')}
						className=' p-1 h-5 w-5'
					>
						<Edit className='h-4 w-4' />
					</Button>
				)}{' '}
				Password
			</h1>

			{editStatus === 'password' && (
				<Form {...passwordForm}>
					<form
						onSubmit={passwordForm.handleSubmit(onSubmitUpdatePassword)}
						className='space-y-8 flex flex-col pt-2 flex-items-center justify-center align-center w-2/3 lg:w-1/3'
					>
						<FormField
							control={passwordForm.control}
							name='current_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											id='current_password'
											autoComplete='current-password'
											required={true}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={passwordForm.control}
							name='new_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<PasswordInput
											id='new_password'
											autoComplete='new-password'
											required={true}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={passwordForm.control}
							name='confirm_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
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
						<Button type='submit'>Change Password</Button>
					</form>
				</Form>
			)}
		</>
	)
}

export default ProfileForm
