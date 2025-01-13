import { getAuth, connectAuthEmulator } from '@firebase/auth';
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore';
import { auth, db } from './firebase';

export const initializeEmulators = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // Connect to emulators
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      
      console.log('Firebase emulators initialized');
    } catch (error) {
      console.error('Error initializing emulators:', error);
    }
  }
}; 