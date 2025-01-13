import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const handleGoogleSignIn = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    // Get the user's token immediately after sign-in
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // Store the token in localStorage for persistent auth
    localStorage.setItem('authToken', token);
    
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
} 