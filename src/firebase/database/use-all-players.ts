'use client';
import * as React from 'react';
import { ref, onValue, query, getDatabase } from 'firebase/database';

export type PlayerPublicData = {
    uid: string;
    username: string;
    netWorth: number;
    avatar: string;
    level: number;
    role: 'player' | 'admin' | 'president';
    lastSeen?: number;
};

export function useAllPlayers() {
  const [players, setPlayers] = React.useState<PlayerPublicData[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const database = getDatabase();
    if (!database) {
      setLoading(false);
      setPlayers(null);
      return;
    }

    setLoading(true);
    // Removed orderByChild('username') as it can cause the query to return null 
    // if any player record is missing the username field.
    const playersRef = query(ref(database, 'players'));

    const unsubscribe = onValue(playersRef, (snapshot) => {
        const playersData = snapshot.val() || {};
        const playersList: PlayerPublicData[] = Object.keys(playersData).map(uid => ({
            ...playersData[uid],
            uid,
        }));
        setPlayers(playersList);
        setLoading(false);
    }, (err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching players:", err);
    });


    return () => {
        unsubscribe();
    };
  }, []);

  return { players, loading, error };
}
