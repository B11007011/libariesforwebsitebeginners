declare module 'firebase/app' {
  export interface FirebaseOptions {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }

  export function initializeApp(options: FirebaseOptions): any;
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    [key: string]: any;
  }

  export function getAuth(app: any): any;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, callback: (user: User | null) => void): () => void;
  export function updateProfile(user: any, profile: { displayName?: string; photoURL?: string }): Promise<void>;
}

declare module 'firebase/firestore' {
  export function getFirestore(app: any): any;
} 