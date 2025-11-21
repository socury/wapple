import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { config } from './env';

const firebaseConfig = {
  apiKey: "AIzaSyDiFP9he4D0fI_TUZFIGzGY3uZh46Yx-Mc",
  authDomain: "wapple-wifi.firebaseapp.com",
  projectId: "wapple-wifi",
  storageBucket: "wapple-wifi.firebasestorage.app",
  messagingSenderId: "342406608184",
  appId: "1:342406608184:web:807573b3f942fe46227dcd"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore();
