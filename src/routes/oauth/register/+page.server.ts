import { db } from '$lib/server/db';
import { application, user, userApplications } from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { v7 } from 'uuid';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { generateToken } from '$lib/server/jwt-auth';

const schema = z.object({
	username: z.string().min(1, 'Name is required'),
	email: z.string().email('You need to insert an email'),
	password: z.string().min(12, 'Password is required'),
	clientId: z.string().min(1, 'Client id is not set'),
	customRedirectUri: z.string().nullish()
});

export const load: PageServerLoad = async ({ url }) => {
	const clientId = url.searchParams.get('clientId');
	if (clientId == null) {
		return error(404, {
			message: 'Request not valid'
		});
	}
	const [app] = await db
		.select({
			name: application.name,
			clientId: application.clientId
		})
		.from(application)
		.where(eq(application.clientId, clientId));
	if (app == null) {
		return error(404, {
			message: 'Request not valid'
		});
	}
	return { app, customRedirect: url.searchParams.get('redirectTo') };
};

export const actions: Actions = {
	signup: async ({ request, url }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const result = schema.safeParse(data);

		if (!result.success) {
			return fail(422, { errors: result.error.flatten().fieldErrors });
		}

		const tosave = result.data;
		console.log(tosave, formData)

		const [app] = await db
			.select()
			.from(application)
			.where(eq(application.clientId, tosave.clientId));
		if (!app) {
			return fail(422, { error: 'Client id not valid' });
		}

		if (
			(app.redirectUri == null || app.redirectUri.trim() == '') &&
			(tosave.customRedirectUri == null || tosave.customRedirectUri.trim() == '')
		) {
			return fail(422, { error: 'No redirect url found' });
		}


		// COME GESTIRE IL CASO IN CUI UN UTENTE E' GIA' REGISTRATO MA STA ACCEDENDO AD UNA NUOVA APP?
		let [foundUser] = await db
			.select()
			.from(user)
			.where(
				or(
					eq(user.username, tosave.username.trim()),
					eq(user.email, tosave.email.trim().toLowerCase())
				)
			);
		if (foundUser) {
			return fail(422, { error: 'Username or email has already been taken' });
		}

		const passwordHash = await hash(tosave.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		foundUser = {
			id: v7(),
			username: tosave.username.trim(),
			email: tosave.email.trim().toLowerCase(),
			passwordHash: passwordHash,
			isAdmin: false
		};
		await db.insert(user).values(foundUser);

		await db.insert(userApplications).values({
			applicationId: app.id,
			userId: foundUser.id
		})

		const tokenData = await generateToken(foundUser, app);

		let redirectUri = app.redirectUri?.trim();
		if (tosave.customRedirectUri) {
			redirectUri = tosave.customRedirectUri.trim();
		}

		return redirect(303, `${redirectUri}?t=${tokenData.access_token}&r=${tokenData.refresh_token}`);
	}
};

const sleep = (time: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};
