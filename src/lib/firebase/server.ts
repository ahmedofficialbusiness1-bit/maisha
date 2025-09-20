// src/lib/firebase/server.ts
import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "studio-3569606942-35878"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    // Use application default credentials in a managed environment
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
}

const adminAuth = admin.auth();

export { adminAuth };
