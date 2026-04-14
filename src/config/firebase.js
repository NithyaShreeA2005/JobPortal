// ─────────────────────────────────────────────
//  HOW TO SET UP FIREBASE:
//  1. Go to https://console.firebase.google.com
//  2. Create a new project (or use existing)
//  3. Add a Web App to get your config values
//  4. Enable "Email/Password" in Authentication > Sign-in methods
//  5. Create a Firestore Database (start in test mode)
//  6. Replace the placeholder values below with your real config
// ─────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

// Persistent login — survives app restarts
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
