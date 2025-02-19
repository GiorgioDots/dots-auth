import type { PageServerLoad } from './$types';
import * as tables from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id == 'new') {
		return {
			app: {
				id: '',
				clientId: '',
				clientSecret: '',
				name: '',
				redirectUri: '',
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
