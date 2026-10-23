export function authError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : ''
  switch (code) {
    case 'auth/invalid-credential': case 'auth/user-not-found': case 'auth/wrong-password':
      return 'We couldn’t sign you in. Check your email and password and try again.'
    case 'auth/email-already-in-use': return 'An account already uses this email. Sign in or reset your password.'
    case 'auth/weak-password': return 'Choose a stronger password with at least 8 characters.'
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a few minutes before trying again.'
    case 'auth/network-request-failed': return 'Couldn’t connect. Check your connection and try again.'
    case 'auth/popup-closed-by-user': case 'auth/cancelled-popup-request': return 'Google sign-in was closed. You can try again.'
    case 'auth/popup-blocked': return 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.'
    case 'auth/unauthorized-domain': case 'auth/operation-not-allowed': case 'auth/invalid-api-key': case 'auth/configuration-not-found':
      return 'This sign-in method needs Firebase setup. You can explore the demo without an account.'
    case 'auth/requires-recent-login': return 'Please sign out and sign in again before making this change.'
    case 'permission-denied': return 'Your account is signed in, but profile storage is unavailable. The project owner needs to publish the Firestore rules.'
    default: return 'That request didn’t finish. Please try again.'
  }
}
