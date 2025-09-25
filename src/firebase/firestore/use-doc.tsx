'use client';
import * as React from 'react';
import { onSnapshot, type DocumentReference, type DocumentData } from 'firebase/firestore';

export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!docRef) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          setData(snapshot.data() as T);
        } else {
          setData(null);
        }
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err);
        console.error(`Error listening to doc ${docRef.path}:`, err);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
