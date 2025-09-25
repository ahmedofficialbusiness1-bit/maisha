
'use client';

import * as React from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// A single-element tuple is a trick to hold a reference to a value
// that can be shared between component instances.
type FirebaseInstances = [
  {
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  }
];

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
  const instances = React.useRef<FirebaseInstances>();

  if (typeof window !== 'undefined' && !instances.current) {
    instances.current = [initializeFirebase()];
  }

  if (!instances.current || !instances.current[0].app) {
    // This can happen if the Firebase config is not set.
    // We render the children without the provider, and any component
    // that tries to use Firebase will throw an error. This is better
    // than crashing the whole app.
    return <>{children}</>;
  }

  const [{ app, auth, firestore }] = instances.current;

  // This check is redundant due to the one above, but it's good for type safety.
  if (!app || !auth || !firestore) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
