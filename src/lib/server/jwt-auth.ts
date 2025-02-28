import crypto from 'crypto';
import { refreshToken, type Application, type RefreshToken, type User } from './db/schema';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { v7 } from 'uuid';
import { env } from '$env/dynamic/private';

export const generateToken = async (
	user: User,
	application: Application
): Promise<JwtAuthResponseDTO> => {
	const token = jwt.sign(
		{
			userId: user.id,
			username: user.username,
			isAdmin: user.isAdmin,
			aud: application.clientId,
			iss: env.JWT_ISSUER
		},
		application.clientSecret,
		{
			expiresIn: application.tokenExpirationSeconds
		}
	);

	const generatedRefreshToken = generateRefreshToken();

	await db.insert(refreshToken).values({
		id: v7(),
		userId: user.id,
		refreshToken: generatedRefreshToken,
		expiresAt: new Date(Date.now() + application.refreshTokenExpirationSeconds * 1000),
		idApplication: application.id
	});

	return {
		access_token: token,
		refresh_token: generatedRefreshToken,
		expires_at: Date.now() + application.tokenExpirationSeconds * 1000
	};
};

export type JwtAuthResponseDTO = {
	access_token: string;
	refresh_token: string;
	expires_at: number;
};

function generateRefreshToken(): string {
	return crypto.randomBytes(40).toString('hex'); // Generate a secure random token
}
