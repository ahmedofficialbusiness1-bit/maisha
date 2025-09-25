'use client';

import * as React from 'react';
import type { CollectionReference, Query } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export function useCollection<T>(ref: CollectionReference | Query | null) {
  const [data, setData] = React.useState<T[]>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!ref) {
      setData(undefined);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as T;
      });
      setData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ref]);

  return { data, loading };
}
