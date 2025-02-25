import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { application, user, type User } from '$lib/server/db/schema';
import { v7 } from 'uuid';
import { register } from '$lib/server/auth/register';

export const load: PageServerLoad = async (event) => {
	const params = event.url.searchParams;
	const client_id = params.get('client_id') || '';
	const redirect_uri = params.get('redirect_uri') || '';
	const stateT = params.get('state') || '';
	if (!client_id || !redirect_uri || !stateT) {
		return error(400, {
			message: 'Request not valid'
		});
	}

	const [app] = await db.select().from(application).where(eq(application.clientId, client_id));
	if (!app) {
		return error(400, {
			message: 'Request not valid'
		});
	}
	return {
		user: event.locals?.user,
		params: {
			client_id,
			redirect_uri,
			stateT
		},
		app
	};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const login = formData.get('login');
		const password = formData.get('password');

		if (!validateUsername(login)) {
			return fail(400, {
				message: 'Invalid credentials'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid credentials' });
		}

		const results = await db.select().from(user).where(eq(user.username, login));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return { user: existingUser };
	},
	register: async (event) => {
		const result = await register(event.request);

		if (!result.user) {
			return fail(400, { errors: result.errors ?? { generic: 'Something went wrong' } });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, result.user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return { user: result.user };
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
