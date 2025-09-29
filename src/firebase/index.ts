'use client';

import { app } from './config';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { FirebaseProvider, useFirebase, useAuth, useFirestore, useFirebaseApp, useDatabase } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useDoc } from './firestore/use-doc';
import { useCollection } from './firestore/use-collection';

function initializeFirebase() {
  if (!app) {
    return { app: null, auth: null, firestore: null, database: null };
  }
  const auth = getAuth(app);
  const database = getDatabase(app);
  // Firestore is not used in this version, but we keep the structure
  const firestore = null; 
  return { app, auth, firestore, database };
}


export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useDoc,
  useCollection,
  useFirebase,
  useAuth,
  useFirestore,
  useFirebaseApp,
  useDatabase
};
