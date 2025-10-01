
'use client';
import * as React from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { useDatabase } from '..';

export type PlayerPublicData = {
    uid: string;
    username: string;
    email?: string | null;
    netWorth: number;
    avatar: string;
    level: number;
    role: 'player' | 'admin';
    lastSeen?: number;
};

export function useAllPlayers() {
  const database = useDatabase();
  const [players, setPlayers] = React.useState<PlayerPublicData[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!database) {
      setLoading(false);
      setPlayers(null);
      return;
    }

    setLoading(true);
    const playersRef = query(ref(database, 'players'), orderByChild('username'));
    const usersRef = ref(database, 'users');

    let playersData: Record<string, Omit<PlayerPublicData, 'uid'>> = {};
    let usersData: Record<string, { lastSeen?: number; email?: string | null }> = {};
    
    const combineData = () => {
        const combined = Object.keys(playersData).map(uid => ({
            ...playersData[uid],
            uid,
            lastSeen: usersData[uid]?.lastSeen,
            email: usersData[uid]?.email,
        }));
        setPlayers(combined);
    };

    const playersUnsubscribe = onValue(playersRef, (snapshot) => {
        playersData = snapshot.val() || {};
        combineData();
        setLoading(false);
    }, (err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching players:", err);
    });

    const usersUnsubscribe = onValue(usersRef, (snapshot) => {
        usersData = snapshot.val() || {};
        combineData();
    }, (err) => {
        console.warn("Could not fetch all user details for status:", err.message);
    });

    return () => {
        playersUnsubscribe();
        usersUnsubscribe();
    };
  }, [database]);

  return { players, loading, error };
}

    