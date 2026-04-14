import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// ── Sign Up ───────────────────────────────────────────────────────────────────
export const signUpUser = async (name, email, password) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = credential;

    // Store extra details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: friendlyError(error.code) };
  }
};

// ── Sign In ───────────────────────────────────────────────────────────────────
export const signInUser = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (error) {
    return { success: false, error: friendlyError(error.code) };
  }
};

// ── Sign Out ──────────────────────────────────────────────────────────────────
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ── Get User Profile from Firestore ──────────────────────────────────────────
export const getUserProfile = async (uid) => {
  try {
    const snapshot = await getDoc(doc(db, 'users', uid));
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    }
    return { success: false, error: 'Profile not found.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ── Map Firebase error codes to friendly messages ────────────────────────────
const friendlyError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
