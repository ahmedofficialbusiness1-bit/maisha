
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
    const playersRef = ref(database, 'players');
    const q = query(playersRef, orderByChild('username'));

    const unsubscribe = onValue(
      q,
      (snapshot) => {
        setLoading(false);
        const result: PlayerPublicData[] = [];
        snapshot.forEach((childSnapshot) => {
          // The public data does not contain lastSeen by default, so we query the private user data for it
          const userRef = ref(database, `users/${childSnapshot.key}`);
          onValue(userRef, (userSnap) => {
              const userData = userSnap.val();
              const playerData = childSnapshot.val();
              // Find if player already exists in result and update, otherwise push
              const existingPlayerIndex = result.findIndex(p => p.uid === childSnapshot.key);
              const playerWithStatus = { ...playerData, uid: childSnapshot.key, lastSeen: userData?.lastSeen };

              if (existingPlayerIndex > -1) {
                  result[existingPlayerIndex] = playerWithStatus;
              } else {
                  result.push(playerWithStatus);
              }
               // This is inefficient as it creates a new array on every user update, but it's simple
              setPlayers([...result]);
          }, { onlyOnce: true });
        });
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err);
        console.error(`Error listening to players collection:`, err);
      }
    );

    return () => unsubscribe();
  }, [database]);
  
  // This effect is needed because the onValue for users is async and we need to update players state
  // This is not the most efficient way but it works for this scenario
  React.useEffect(() => {
      if (!database) return;
      const usersRef = ref(database, 'users');
      const unsubscribe = onValue(usersRef, (snapshot) => {
          setPlayers(prevPlayers => {
              if (!prevPlayers) return null;
              const updatedPlayers = prevPlayers.map(p => {
                  const userData = snapshot.child(p.uid).val();
                  return { ...p, lastSeen: userData?.lastSeen };
              })
              return updatedPlayers;
          });
      });
      return () => unsubscribe();
  }, [database]);


  return { players, loading, error };
}

