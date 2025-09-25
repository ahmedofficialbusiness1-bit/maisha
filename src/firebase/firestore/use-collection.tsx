'use client';
import * as React from 'react';
import { onSnapshot, type Query, type DocumentData } from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = React.useState<T[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!query) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        setLoading(false);
        const result: T[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setData(result);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err);
        console.error(`Error listening to collection:`, err);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
