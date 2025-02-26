import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';

const schema = z.object({
	login: z.string().min(1, 'Login is required'),
	password: z.string().min(1, 'Password is required')
});

export const login = async (request: Request) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const result = schema.safeParse(data);

	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors };
	}

	const { login, password } = result.data;

	const [foundUser] = await db.select().from(user).where(eq(user.username, login));

	if (!foundUser) {
		return { errors: { generic: 'Invalid credentials' } };
	}

	const validPassword = await verify(foundUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	if (!validPassword) {
		return { errors: { generic: 'Invalid credentials' } };
	}

	return { user: foundUser };
};
