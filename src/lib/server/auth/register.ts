import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '../db';
import { application, user } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { v7 } from 'uuid';

const schema = z.object({
	username: z.string().min(1, 'Name is required'),
	email: z.string().email('You need to insert an email'),
	password: z.string().min(12, 'Password need to be at least 12 characters')
});

export const register = async (request: Request) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const result = schema.safeParse(data);

	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors };
	}

	const tosave = result.data;

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
		return { errors: { generic: 'Request not valid' } };
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

	return { user: foundUser };
};
