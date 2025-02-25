import { db } from '$lib/server/db/index.js';
import { application } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies }) {
	const body = await request.formData();
	const client_id = body.get('client_id');
	const grant_type = body.get('grant_type');
	const code = body.get('code');
	const code_verifier = body.get('code_verifier');

	if (
		grant_type !== 'authorization_code' ||
		!code ||
		!code_verifier ||
		!client_id ||
		typeof code_verifier != 'string' ||
		typeof client_id != 'string'
	) {
		return json({ error: 'invalid_request' }, { status: 400 });
	}

	const [app] = await db.select().from(application).where(eq(application.clientId, client_id));
	if (!app) {
		return json({ error: 'invalid_request' }, { status: 400 });
	}

	// Simuliamo il recupero della code_challenge salvata
	const stored_code_challenge = cookies.get('oauth_code_challenge');

	// Verifica code_verifier -> code_challenge
	const challenge = await computeCodeChallenge(code_verifier);
	if (challenge !== stored_code_challenge) {
		return json({ error: 'invalid_grant' }, { status: 400 });
	}

	cookies.delete('oauth_code_challenge', {
		path: '/token'
	});

	// Genera access token e refresh token (dovresti usare una libreria JWT)
	const access_token = 'ACCESS_TOKEN';
	const refresh_token = 'REFRESH_TOKEN';

	return json({
		access_token,
		token_type: 'Bearer',
		expires_in: 3600,
		refresh_token
	});
}

async function computeCodeChallenge(codeVerifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);

	return base64UrlEncode(digest);
}

// Helper function to convert ArrayBuffer to Base64-URL format
function base64UrlEncode(buffer: ArrayBuffer): string {
	const binary = String.fromCharCode(...new Uint8Array(buffer));
	return btoa(binary)
		.replace(/\+/g, '-') // Replace "+" with "-"
		.replace(/\//g, '_') // Replace "/" with "_"
		.replace(/=+$/, ''); // Remove padding "="
}
