import { db } from '$lib/server/db/index.js';
import { application } from '$lib/server/db/schema.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const client_id = url.searchParams.get('client_id');
	const redirect_uri = url.searchParams.get('redirect_uri');
	const code_challenge = url.searchParams.get('code_challenge');
	const state = url.searchParams.get('state');

	// Validazione dei parametri
	if (!client_id || !redirect_uri || !code_challenge || !state) {
		error(400, {
			message: 'Bad request'
		});
	}

	const [app] = await db.select().from(application).where(eq(application.clientId, client_id));
	if (!app) {
		error(400, {
			message: 'Bad request'
		});
	}

	// Reindirizza al login
	return redirect(
		302,
		`/oauth/authenticate?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&code_challenge=${code_challenge}`
	);
};
