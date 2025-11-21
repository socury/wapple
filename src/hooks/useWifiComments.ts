import { useEffect, useMemo, useState } from 'react';
import type { WifiComment } from '../utils/types/comment';
import { useAuth } from './useAuth';
import { db } from '../libs/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import i18n from '../libs/i18n';

type CommentsByWifi = Record<string, WifiComment[]>;

const generateId = () => `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useWifiComments = () => {
  const { user } = useAuth();
  const [commentsByWifi, setCommentsByWifi] = useState<CommentsByWifi>({});

  // Removed localStorage persistence; Firestore is source of truth.

  const addComment = (wifiId: string, content: string, parentId?: string) => {
    if (!user) {
      if (typeof window !== 'undefined') window.alert(i18n.t('comments.loginAlert'));
      return;
    }

    const newComment: WifiComment = {
      id: generateId(),
      wifiId,
      ...(parentId ? { parentId } : {}),
      content,
      createdAt: new Date().toISOString(),
      authorName: user.displayName ?? user.email ?? '익명',
    };

    setCommentsByWifi((prev) => ({
      ...prev,
      [wifiId]: [...(prev[wifiId] ?? []), newComment],
    }));

    // persist to firestore
    (async () => {
      try {
        const docRef = doc(db, 'users', user.uid, 'comments', newComment.id);
        await setDoc(docRef, newComment);
      } catch (error) {
        console.error('Failed to save comment to firestore', error);
      }
    })();
  };

  useEffect(() => {
    const fetchFromFirestore = async () => {
      if (!user) return;
      try {
        const collRef = collection(db, 'users', user.uid, 'comments');
        const snaps = await getDocs(collRef);
        const items: CommentsByWifi = {};
        snaps.docs.forEach((d) => {
          const c = d.data() as WifiComment;
          items[c.wifiId] = [...(items[c.wifiId] ?? []), c];
        });
        setCommentsByWifi(items);
      } catch (error) {
        console.error('Failed to load comments from firestore', error);
      }
    };

    fetchFromFirestore();
  }, [user]);

  const getComments = (wifiId: string) => commentsByWifi[wifiId] ?? [];

  const commentCount = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(commentsByWifi).forEach(([wifiId, comments]) => {
      counts[wifiId] = comments.length;
    });
    return counts;
  }, [commentsByWifi]);

  return {
    commentsByWifi,
    getComments,
    addComment,
    commentCount,
  };
};
