import { initializeApp, FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  connectAuthEmulator,
  Auth 
} from '@firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  Firestore 
} from '@firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    const authEmulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL;
    const [firestoreHost, firestorePort] = (import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST || '').split(':');
    
    if (authEmulatorUrl) {
      connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
    }
    
    if (firestoreHost && firestorePort) {
      connectFirestoreEmulator(db, firestoreHost, parseInt(firestorePort, 10));
    }
    
    console.log('Using Firebase Emulators');
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}

export { app, auth, db, googleProvider }; 