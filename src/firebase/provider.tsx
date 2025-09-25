'use client';

import * as React from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Database } from 'firebase/database';

const FirebaseAppContext = React.createContext<FirebaseApp | undefined>(undefined);
const AuthContext = React.createContext<Auth | undefined>(undefined);
const FirestoreContext = React.createContext<Firestore | undefined>(undefined);
const DatabaseContext = React.createContext<Database | undefined>(undefined);

FirebaseAppContext.displayName = 'FirebaseAppContext';
AuthContext.displayName = 'AuthContext';
FirestoreContext.displayName = 'FirestoreContext';
DatabaseContext.displayName = 'DatabaseContext';

export interface FirebaseProviderProps {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore | null; // Firestore can be null
  database: Database;
}

export function FirebaseProvider({ children, app, auth, firestore, database }: FirebaseProviderProps) {
  return (
    <FirebaseAppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <FirestoreContext.Provider value={firestore || undefined}>
           <DatabaseContext.Provider value={database}>
              {children}
            </DatabaseContext.Provider>
        </FirestoreContext.Provider>
      </AuthContext.Provider>
    </FirebaseAppContext.Provider>
  );
}

export function useFirebaseApp() {
  const app = React.useContext(FirebaseAppContext);
  if (!app) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return app;
}

export function useAuth() {
  const auth = React.useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return auth;
}

export function useFirestore() {
  const firestore = React.useContext(FirestoreContext);
  if (!firestore) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return firestore;
}

export function useDatabase() {
    const database = React.useContext(DatabaseContext);
    if (!database) {
      throw new Error('useDatabase must be used within a FirebaseProvider');
    }
    return database;
}


// A convenience hook to get all services
export const useFirebase = () => {
    const app = useFirebaseApp();
    const auth = useAuth();
    const firestore = useFirestore();
    const database = useDatabase();

    return { app, auth, firestore, database };
};
