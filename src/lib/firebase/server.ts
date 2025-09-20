// src/lib/firebase/server.ts
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const adminAuth = admin.auth();

export { adminAuth };
