
'use client';

import * as React from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * A client-side component that initializes Firebase and provides it to the
 * React component tree. This should be used at the root of the client-side
 * component tree.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = React.useState<FirebaseInstances | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const firebaseInstances = initializeFirebase();
      if (firebaseInstances.app && firebaseInstances.auth && firebaseInstances.firestore) {
         setInstances({
            app: firebaseInstances.app,
            auth: firebaseInstances.auth,
            firestore: firebaseInstances.firestore
         });
      }
    }
  }, []);

  if (!instances) {
    // While initializing, you might want to show a loader or nothing
    return null;
  }

  return (
    <FirebaseProvider app={instances.app} auth={instances.auth} firestore={instances.firestore}>
      {children}
    </FirebaseProvider>
  );
}
