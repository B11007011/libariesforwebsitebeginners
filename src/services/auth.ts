import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup as firebaseSignInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  Auth,
  UserCredential
} from '@firebase/auth';

// Add loading state management
let authLoadingState = false;
const authLoadingListeners: ((loading: boolean) => void)[] = [];

export const subscribeToAuthLoading = (callback: (loading: boolean) => void) => {
  authLoadingListeners.push(callback);
  return () => {
    const index = authLoadingListeners.indexOf(callback);
    if (index > -1) {
      authLoadingListeners.splice(index, 1);
    }
  };
};

const setAuthLoading = (loading: boolean) => {
  authLoadingState = loading;
  authLoadingListeners.forEach(listener => listener(loading));
};

export const isAuthLoading = () => authLoadingState;

export const signInWithGoogle = async () => {
  try {
    setAuthLoading(true);
    const result = await firebaseSignInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  } finally {
    setAuthLoading(false);
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    setAuthLoading(true);
    const result = await firebaseCreateUser(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  } finally {
    setAuthLoading(false);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    setAuthLoading(true);
    const result = await firebaseSignInWithEmail(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}; 