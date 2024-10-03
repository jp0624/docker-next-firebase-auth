import { HOME_ROUTE, LOGIN_ROUTE } from '@/constants/routes'
import { auth } from '@/services/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

const SignOutButton = () => {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut(auth)
		console.log('user: ', auth.currentUser)
		router.push(HOME_ROUTE)
	}

	return <button onClick={handleSignOut}>Sign Out</button>
}

export default SignOutButton
