import { db } from '$lib/server/db';
import * as tables from '$lib/server/db/schema';
import { error, fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id == 'new') {
		return {
			app: {
				id: '',
				clientId: '',
				clientSecret: '',
				name: '',
				redirectUri: ''
			} as tables.Application
		};
	}
	const [app] = await db
		.select()
		.from(tables.application)
		.where(eq(tables.application.id, params.id));
	if (!app) {
		error(404, {
			message: 'Application not found'
		});
	}
	return {
		app
	};
};

export const actions: Actions = {
	create: async ({locals}) => {
		return {
			message: 'ok'
		};
	}
};
