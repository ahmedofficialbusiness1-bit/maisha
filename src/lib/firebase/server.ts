// src/lib/firebase/server.ts
import * as admin from 'firebase-admin';

// This is a placeholder for your Firebase project config.
// For a real application, you should use environment variables.
const firebaseConfig = {
  "projectId": "studio-3569606942-35878",
  "appId": "1:646151071371:web:04422b87a9e2660cd2568e",
  "apiKey": "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  "authDomain": "studio-3569606942-35878.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "646151071371"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    // Use application default credentials in a managed environment
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  });
}

const adminAuth = admin.auth();

export { adminAuth };
