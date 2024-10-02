import LoginForm from '@/components/LoginForm'
import Login from '@/components/LoginForm'
import { REGISTER_ROUTE } from '@/constants/routes'
import Link from 'next/link'

const LoginPage = () => {
	return (
		<>
			<LoginForm />
			<p className='text-sm p-5'>
				Don't have an account?
				<Link href={REGISTER_ROUTE}>
					<span className='underline px-2'>Register Here</span>
				</Link>
			</p>
		</>
	)
}

export default LoginPage
