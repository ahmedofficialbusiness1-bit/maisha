'use server';

import { z } from 'zod';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { db } from '@/lib/db';
import { userTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { cache } from 'react';
import type { Session, User } from 'lucia';

const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(31, { message: 'Username must be at most 31 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(255, { message: 'Password must be at most 255 characters long' }),
});

export async function signup(
  values: z.infer<typeof signupSchema>
): Promise<{ error: string } | { error?: undefined }> {
  const { username, password } = signupSchema.parse(values);

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    await db.insert(userTable).values({
      id: userId,
      username: username,
      hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {};
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        error: 'Username already taken',
      };
    }
    return {
      error: 'An unknown error occurred',
    };
  }
}

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function login(
  values: z.infer<typeof loginSchema>
): Promise<{ error: string } | { error?: undefined }> {
  const { username, password } = loginSchema.parse(values);

  const existingUser = (
    await db.select().from(userTable).where(eq(userTable.username, username))
  )[0];

  if (!existingUser) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password
  );
  if (!validPassword) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return {};
}

export async function logout(): Promise<{ error: string } | { error?: undefined }> {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return {};
}


export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);
