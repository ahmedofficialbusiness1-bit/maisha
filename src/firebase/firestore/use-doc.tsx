'use client';

import * as React from 'react';
import type { DocumentReference } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export function useDoc<T>(ref: DocumentReference | null) {
  const [data, setData] = React.useState<T | null>();
  const [loading, setLoading] = React.useState(true);

  const setDataAndLoading = React.useCallback((data: T | null) => {
    setData(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        setData(null);
        setLoading(false);
        return;
      }
      const data = {
        id: snapshot.id,
        ...snapshot.data(),
      } as T;
      setData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ref]);

  return { data, setData: setDataAndLoading, loading };
}
