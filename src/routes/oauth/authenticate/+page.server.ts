import * as auth from '$lib/server/auth';
import { login } from '$lib/server/auth/login';
import { register } from '$lib/server/auth/register';
import { db } from '$lib/server/db';
import {
	application,
	userApplications,
	userApplicationsCodes,
	type Application
} from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { connectApp, getConnectAppDataFromRequest } from '$lib/server/auth/connect_app';
import { randomUUID } from 'crypto';
import { v7 } from 'uuid';

export const load: PageServerLoad = async (event) => {
	const params = event.url.searchParams;
	const client_id = params.get('client_id') || '';
	const redirect_uri = params.get('redirect_uri') || '';
	const state = params.get('state') || '';
	const code_challenge = params.get('code_challenge') || '';
	if (!client_id || !redirect_uri || !state || !code_challenge) {
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

	// if (event.locals.user) {
	// 	const [userApp] = await db
	// 		.select()
	// 		.from(userApplications)
	// 		.where(
	// 			and(
	// 				eq(userApplications.applicationId, app.id),
	// 				eq(userApplications.userId, event.locals.user.id)
	// 			)
	// 		);
	// 	if (userApp != null) {
	// 		return await generateCodeAndRedirect(userApp.id, redirect_uri, state, code_challenge);
	// 	}
	// }

	return {
		user: event.locals.user,
		params: {
			client_id,
			redirect_uri,
			state,
			code_challenge
		},
		app
	};
};

export const actions: Actions = {
	login: async (event) => {
		const result = await login(event.request);
		if (!result.user) {
			return fail(400, { errors: result.errors ?? { generic: 'Something went wrong' } });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, result.user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return { user: { id: result.user.id } };
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
	},
	connect: async (event) => {
		if (!event.locals.user) {
			return fail(400, { errors: { generic: 'Request not valid' } });
		}
		const data = await getConnectAppDataFromRequest(event.request);
		if (!data.data) {
			return fail(400, data.errors);
		}
		const userApp = await connectApp(data.data, event.locals.user);
		return await generateCodeAndRedirect(
			userApp.id,
			data.data.redirect_uri,
			data.data.state,
			data.data.code_challenge,
			303
		);
	}
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const generateCodeAndRedirect = async (
	idUserApp: string,
	redirect_uri: string,
	state: string,
	code_challenge: string,
	status = 302
) => {
	const code = randomUUID();
	await db.insert(userApplicationsCodes).values({
		id: v7(),
		code: code,
		codeChallenge: code_challenge,
		idUserApplication: idUserApp,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	});
	return redirect(status, `${redirect_uri}?code=${code}&state=${state}`);
};
