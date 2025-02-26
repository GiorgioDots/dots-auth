import { db } from '$lib/server/db';
import * as tables from '$lib/server/db/schema';
import { error, fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { v7 } from 'uuid';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	clientId: z.string().min(1, 'Client ID is required'),
	clientSecret: z.string().min(1, 'Client Secret is required'),
	tokenExpirationSeconds: z.preprocess(
		(val) => (val === '' ? null : Number(val)),
		z.number().int().positive().min(60).max(86400)
	),
	refreshTokenExpirationSeconds: z.preprocess(
		(val) => (val === '' ? null : Number(val)),
		z.number().int().positive().min(60)
	)
});

export const load: PageServerLoad = async ({ params }) => {
	if (params.id == 'new') {
		return {
			app: {
				id: '',
				clientId: '',
				clientSecret: '',
				name: '',
				refreshTokenExpirationSeconds: 604800,
				tokenExpirationSeconds: 300
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
	createupdate: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const parsedData = {
			...data,
			tokenExpirationSeconds:
				data.tokenExpirationSeconds && data.tokenExpirationSeconds.toString().trim() !== ''
					? Number(data.tokenExpirationSeconds)
					: null,
			refreshTokenExpirationSeconds:
				data.refreshTokenExpirationSeconds &&
				data.refreshTokenExpirationSeconds.toString().trim() !== ''
					? Number(data.refreshTokenExpirationSeconds)
					: null
		};

		const result = schema.safeParse(parsedData);

		if (!result.success) {
			return fail(422, { errors: result.error.flatten().fieldErrors });
		}

		const app = result.data as tables.Application;

		const isNew = app.id == '';

		if (isNew) {
			app.id = v7();
			await db.insert(tables.application).values(app);
		} else {
			const [found] = await db
				.select()
				.from(tables.application)
				.where(eq(tables.application.id, app.id));
			if (!found) {
				return fail(404, {
					message: 'Application not found'
				});
			}
			await db.update(tables.application).set(app).where(eq(tables.application.id, app.id));
		}
		return {
			app
		};
	}
};
