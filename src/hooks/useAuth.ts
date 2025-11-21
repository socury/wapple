import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../libs/firebase';

type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
} | null;

export const useAuth = () => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL });
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  const signIn = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  return { user, signIn, signOut: signOutUser };
};
