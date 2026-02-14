// Firebase is disabled for now - will be enabled when Google Sign-In is configured
// Uncomment the code below when you're ready to enable Firebase authentication

/*
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyALzDguYcaNH5hSuSnW1SnDG02NlOPwX9k",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "aiims-hand-hygiene-porta-852b6.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "aiims-hand-hygiene-porta-852b6",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "aiims-hand-hygiene-porta-852b6.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "811357834897",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:811357834897:web:b669e7ac1ec6cdec877930",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-N12FDRMETM",
};

let app = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('[Firebase] Initialized successfully');
} catch (error) {
  console.log('[Firebase] Initialization skipped:', error.message);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
};

export default app;
*/

// Temporary exports for compatibility
export const auth = null;
export const googleProvider = null;
export const signInWithEmailAndPassword = null;
export const createUserWithEmailAndPassword = null;
export const signOut = null;
export const sendPasswordResetEmail = null;
export default null;
