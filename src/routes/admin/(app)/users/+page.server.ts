import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { application, user, userApplications } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
	const users = await db
		.select()
		.from(user)
		.leftJoin(userApplications, eq(user.id, userApplications.userId))
		.leftJoin(application, eq(application.id, userApplications.applicationId));
	return { users };
};
