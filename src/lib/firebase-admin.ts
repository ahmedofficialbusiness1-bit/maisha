
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';

function getAdminApp(): App {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp();
}

export const adminApp = getAdminApp();
