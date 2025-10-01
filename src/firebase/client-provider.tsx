'use client';

import * as React from 'react';
import { initializeFirebase, FirebaseProvider } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Database } from 'firebase/database';
import { Loader2 } from 'lucide-react';


export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = React.useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
    database: Database | null;
  } | null>(null);

  React.useEffect(() => {
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  if (!services || !services.app || !services.auth || !services.database || !services.firestore) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
      database={services.database}
    >
      {children}
    </FirebaseProvider>
  );
}
