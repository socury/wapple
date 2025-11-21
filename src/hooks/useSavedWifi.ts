import { useEffect, useState } from 'react';
import type { WifiPoint } from '../utils/types/wifi';
import type { SavedWifiEntry } from '../utils/types/savedWifi';
import type { Location } from '../utils/types/location';
import { useAuth } from './useAuth';
import { db } from '../libs/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

// Local storage removed; initial state empty until Firestore sync.

export const useSavedWifi = () => {
  const { user } = useAuth();
  const [savedWifi, setSavedWifi] = useState<SavedWifiEntry[]>([]);

  // Removed localStorage persistence; Firestore is source of truth.

  useEffect(() => {
    const fetchFromFirestore = async () => {
      if (!user) return;
      try {
        const collRef = collection(db, 'users', user.uid, 'savedWifi');
        const snaps = await getDocs(collRef);
        const items: SavedWifiEntry[] = snaps.docs.map((d) => d.data() as SavedWifiEntry);
        setSavedWifi(items);
      } catch (error) {
        console.error('Failed to load saved wifi from firestore', error);
      }
    };

    fetchFromFirestore();
  }, [user]);

  const saveWifi = async (wifi: WifiPoint, origin: Location, comment?: string) => {
    if (!user) {
      if (typeof window !== 'undefined') window.alert('저장하려면 로그인이 필요합니다.');
      return;
    }

    const savedAt = new Date().toISOString();
    const newEntry: SavedWifiEntry = {
      id: wifi.id,
      wifi,
      origin,
      savedAt,
      ...(comment !== undefined ? { comment } : {}),
    };

    try {
      const docRef = doc(db, 'users', user.uid, 'savedWifi', wifi.id);
      await setDoc(docRef, newEntry);
      setSavedWifi((prev) => {
        const existing = prev.find((entry) => entry.id === wifi.id);
        if (existing) {
          return prev.map((entry) => (entry.id === wifi.id ? { ...entry, ...newEntry } : entry));
        }
        return [...prev, newEntry];
      });
    } catch (error) {
      console.error('Failed to save wifi to firestore', error);
    }
  };

  const removeWifi = async (wifiId: string) => {
    if (!user) {
      if (typeof window !== 'undefined') window.alert('삭제하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid, 'savedWifi', wifiId);
      await deleteDoc(docRef);
      setSavedWifi((prev) => prev.filter((entry) => entry.id !== wifiId));
    } catch (error) {
      console.error('Failed to remove saved wifi', error);
    }
  };

  const clearAll = () => setSavedWifi([]);

  return {
    savedWifi,
    saveWifi,
    removeWifi,
    clearAll,
  };
};
