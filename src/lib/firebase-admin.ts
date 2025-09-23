
import { initializeApp, getApps, getApp, type App, type ServiceAccount, cert } from 'firebase-admin/app';

function getAdminApp(): App {
    if (getApps().length) {
        return getApp();
    }
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('FIREBASE_PRIVATE_KEY is not set');
    }

    const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || "studio-3569606942-35878",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-g2nmy@studio-3569606942-35878.iam.gserviceaccount.com",
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    return initializeApp({
        credential: cert(serviceAccount)
    });
}

export const adminApp = getAdminApp();
