'use server';

import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// This is the only place where we initialize firebase-admin
// to avoid library conflicts.
if (!admin.apps.length) {
  admin.initializeApp();
}
const adminAuth = admin.auth();

type FormState = {
  success: boolean;
  message: string;
} | null;

export async function signUpWithEmailAndPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = formData.get('displayName') as string;

  try {
    const userCredential = await adminAuth.createUser({
      email,
      password,
      displayName,
    });
    await setCookie(userCredential);
  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'An unknown error occurred.',
    };
  }
  redirect('/game');
}

export async function signInWithEmailAndPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // This is a workaround to sign in with email and password using the Admin SDK
  // The Admin SDK does not have a direct signInWithEmailAndPassword method.
  // We make a REST API call to the Firebase Auth endpoint.
  const signInEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

  try {
    const response = await fetch(signInEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Authentication failed.');
    }

    const user = await adminAuth.getUserByEmail(email);
    await setCookie(user);

  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'An unknown error occurred.',
    };
  }

  redirect('/game');
}


async function setCookie(user: UserRecord) {
  const customToken = await adminAuth.createCustomToken(user.uid);
  cookies().set('customToken', customToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function signOut() {
  cookies().delete('customToken');
  redirect('/login');
}
