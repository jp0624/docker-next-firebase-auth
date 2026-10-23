import { z } from 'zod'
export const emailSchema = z.string().trim().email('Enter a valid email address.')
export const newPasswordSchema = z.string().min(8, 'Use at least 8 characters.').max(128, 'Use no more than 128 characters.')
  .regex(/[a-z]/, 'Include a lowercase letter.').regex(/[A-Z]/, 'Include an uppercase letter.').regex(/[0-9]/, 'Include a number.')
export const registrationSchema = z.object({
  first_name: z.string().trim().min(1, 'Enter your first name.').max(60),
  last_name: z.string().trim().min(1, 'Enter your last name.').max(60),
  email: emailSchema, password: newPasswordSchema, confirm_password: z.string(),
}).refine(v => v.password === v.confirm_password, { message: 'Passwords don’t match.', path: ['confirm_password'] })
export const loginSchema = z.object({email: emailSchema, password: z.string().min(1, 'Enter your password.')})
