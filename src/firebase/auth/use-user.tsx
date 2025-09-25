'use client';

import * as React from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase';

export function useUser() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
