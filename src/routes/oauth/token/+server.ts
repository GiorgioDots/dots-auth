import { db } from '$lib/server/db/index.js';
import {
	application,
	refreshToken,
	user,
	userApplications,
	userApplicationsCodes
} from '$lib/server/db/schema.js';
import { generateToken } from '$lib/server/jwt-auth.js';
import { json } from '@sveltejs/kit';
import { and, eq, gt } from 'drizzle-orm';

export async function POST({ request }) {
	const { grant_type, code, code_verifier, refresh_token } = await request.json();

	if (grant_type == 'token') {
		if (!code || !code_verifier) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const [uappcode] = await db
			.select()
			.from(userApplicationsCodes)
			.where(
				and(eq(userApplicationsCodes.code, code), gt(userApplicationsCodes.expiresAt, new Date()))
			)
			.innerJoin(userApplications, eq(userApplications.id, userApplicationsCodes.idUserApplication))
			.innerJoin(user, eq(user.id, userApplications.userId))
			.innerJoin(application, eq(application.id, userApplications.applicationId));

		if (!uappcode) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const stored_code_challenge = uappcode.user_applications_codes.codeChallenge;

		const challenge = await computeCodeChallenge(code_verifier);
		if (challenge !== stored_code_challenge) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const tokenData = await generateToken(uappcode.users, uappcode.applications);

		await db
			.update(userApplicationsCodes)
			.set({
				expiresAt: new Date()
			})
			.where(eq(userApplicationsCodes.id, uappcode.user_applications_codes.id));

		return json({
			access_token: tokenData.access_token,
			token_type: 'Bearer',
			expires_at: tokenData.expires_at,
			refresh_token: tokenData.refresh_token
		});
	}
	if (grant_type == 'refresh_token') {
		if (!refresh_token) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}
		const [savedRefresh] = await db
			.select()
			.from(refreshToken)
			.where(
				and(eq(refreshToken.refreshToken, refresh_token), gt(refreshToken.expiresAt, new Date()))
			)
			.innerJoin(user, eq(user.id, refreshToken.userId))
			.innerJoin(application, eq(application.id, refreshToken.idApplication));

		if (!savedRefresh) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		// Unnecessary check
		const [uapp] = await db
			.select()
			.from(userApplications)
			.where(
				and(
					eq(userApplications.userId, savedRefresh.users.id),
					eq(userApplications.applicationId, savedRefresh.applications.id)
				)
			);
		if (!uapp) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		await db
			.update(refreshToken)
			.set({
				expiresAt: new Date()
			})
			.where(eq(refreshToken.id, savedRefresh.refresh_tokens.id));

		const tokenData = await generateToken(savedRefresh.users, savedRefresh.applications);

		return json({
			access_token: tokenData.access_token,
			token_type: 'Bearer',
			expires_at: tokenData.expires_at,
			refresh_token: tokenData.refresh_token
		});
	}
	return json({ error: 'Invalid request' }, { status: 400 });
}

async function computeCodeChallenge(codeVerifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);

	return base64UrlEncode(digest);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
	const binary = String.fromCharCode(...new Uint8Array(buffer));
	return btoa(binary)
		.replace(/\+/g, '-') // Replace "+" with "-"
		.replace(/\//g, '_') // Replace "/" with "_"
		.replace(/=+$/, ''); // Remove padding "="
}

export function OPTIONS() {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}
