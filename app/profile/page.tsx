import ProfileForm from '@/components/ProfileForm'
import ProtectedRoute from '@/components/ProtectedRoutes'

const ProfilePage = () => {
	return (
		<>
			<ProtectedRoute path={`/profile`}>
				<ProfileForm />
			</ProtectedRoute>
		</>
	)
}

export default ProfilePage
