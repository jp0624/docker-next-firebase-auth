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
const passwordValidation = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/
)

const formSchema = z
	.object({
		email: z.string().email({ message: 'Please enter a valid email address.' }),
		current_password: z.string().trim().min(1, 'Please fill out this field'),
		new_password: z
			.string()
			.trim()
			.min(1, { message: 'Must have at least 1 character' })
			.regex(passwordValidation, {
				message:
					"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one of these special character '!@#$%^&*?'.",
			}),
		confirm_password: z.string().trim().min(1, 'Please fill out this field'),
		first_name: z.string().trim().min(1, 'Please fill out this field'),
		last_name: z.string().trim().min(1, 'Please fill out this field'),
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

	const defaultValues = {
		email: '',
		current_password: '',
		new_password: '',
		confirm_password: '',
		first_name: '',
		last_name: '',
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange',
		values: userData,
	})
	const { handleSubmit: handleFormSubmit } = form

	const onSubmit = handleFormSubmit(() => {
		updateUser(...userData)
	})
	return (
		<>
			<h1 className='text-3xl font-bold mb-2 text-left w-2/3 lg:w-1/3'>
				Profile Form
			</h1>
			<Form {...form}>
				<form
					onSubmit={onSubmit}
					className='space-y-8 flex flex-col flex-items-center justify-center align-center w-2/3 lg:w-1/3'
				>
					<FormField
						control={form.control}
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
						control={form.control}
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
						control={form.control}
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
						control={form.control}
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
					<Button type='submit'>Update Profile</Button>
				</form>
			</Form>
		</>
	)
}

export default ProfileForm
