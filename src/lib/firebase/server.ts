// src/lib/firebase/server.ts
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    // Use application default credentials in a managed environment
    credential: admin.credential.applicationDefault(),
  });
}

const adminAuth = admin.auth();

export { adminAuth };
