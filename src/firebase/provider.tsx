'use client';

import * as React from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const FirebaseAppContext = React.createContext<FirebaseApp | undefined>(
  undefined
);

const AuthContext = React.createContext<Auth | undefined>(undefined);

const FirestoreContext = React.createContext<Firestore | undefined>(undefined);

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseAppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <FirestoreContext.Provider value={firestore}>
          {children}
        </FirestoreContext.Provider>
      </AuthContext.Provider>
    </FirebaseAppContext.Provider>
  );
}

export function useFirebaseApp() {
  return React.useContext(FirebaseAppContext);
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function useFirestore() {
  return React.useContext(FirestoreContext);
}
