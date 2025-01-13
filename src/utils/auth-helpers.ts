import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signInAnonymously,
  AuthError
} from '@firebase/auth';
import { auth, googleProvider } from '../firebase';

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

export const createTestUserIfNeeded = async () => {
  try {
    if (import.meta.env.MODE === 'development') {
      try {
        await signInAnonymously(auth);
        console.log('Signed in anonymously');
        return;
      } catch (error) {
        const authError = error as AuthError;
        console.error('Anonymous auth failed:', authError.code);
      }
    }

    try {
      await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
      console.log('Signed in as test user');
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
          console.log('Test user created and signed in');
        } catch (createError) {
          const authCreateError = createError as AuthError;
          if (authCreateError.code !== 'auth/email-already-in-use') {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Auth process failed:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    if (import.meta.env.MODE === 'development') {
      return createTestUserIfNeeded();
    }

    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Sign in failed:', authError.code, authError.message);
    
    // Re-throw specific errors for better handling
    if (authError.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled by user');
    } else if (authError.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked. Please allow popups for this site.');
    }
    
    throw new Error('Failed to sign in with Google. Please try again.');
  }
}; 