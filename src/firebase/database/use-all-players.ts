
'use client';
import * as React from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { useDatabase } from '..';

export type PlayerPublicData = {
    uid: string;
    username: string;
    netWorth: number;
    avatar: string;
    level: number;
    role: 'player' | 'admin';
    lastSeen?: number; // Added to track online status
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
    // Reference to the public player data
    const playersRef = query(ref(database, 'players'), orderByChild('username'));

    // We will merge data from '/users' for the 'lastSeen' timestamp
    const usersRef = ref(database, 'users');

    let playersData: Record<string, PlayerPublicData> = {};
    let usersData: Record<string, { lastSeen?: number }> = {};
    
    const combineData = () => {
        const combined = Object.keys(playersData).map(uid => ({
            ...playersData[uid],
            lastSeen: usersData[uid]?.lastSeen,
        }));
        setPlayers(combined);
    };

    const playersUnsubscribe = onValue(playersRef, (snapshot) => {
        playersData = snapshot.val() || {};
        Object.keys(playersData).forEach(uid => {
            playersData[uid].uid = uid; // Ensure UID is part of the object
        });
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
        // Errors from this listener can be noisy if rules restrict access,
        // so we might choose to log them quietly.
        console.warn("Could not fetch all user details for status:", err.message);
    });

    return () => {
        playersUnsubscribe();
        usersUnsubscribe();
    };
  }, [database]);

  return { players, loading, error };
}

