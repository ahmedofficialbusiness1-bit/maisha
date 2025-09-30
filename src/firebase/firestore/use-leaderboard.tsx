'use client';
import * as React from 'react';
import { collection, query, orderBy, limit, onSnapshot, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '..';

export type LeaderboardEntry = {
    playerId: string;
    username: string;
    score: number;
    avatar: string;
    level: number;
}

export function useLeaderboard() {
  const firestore = useFirestore();
  const [data, setData] = React.useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!firestore) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const leaderboardRef = collection(firestore, 'leaderboard');
    const q = query(leaderboardRef, orderBy('score', 'desc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setLoading(false);
        const result: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
          // Use doc.id as the unique key, which is the player's UID
          result.push({ playerId: doc.id, ...doc.data() } as LeaderboardEntry);
        });
        setData(result);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err);
        console.error(`Error listening to leaderboard collection:`, err);
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  return { data, loading, error };
}
