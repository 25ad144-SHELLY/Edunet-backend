import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const globalProcess = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
const env = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env 
  : (globalProcess?.env || {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment12345",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "edunet-portal.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "edunet-portal",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "edunet-portal.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;