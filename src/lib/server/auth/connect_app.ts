import { z } from 'zod';
import { db } from '../db';
import { application, userApplications } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { v7 } from 'uuid';

export const schema = z.object({
	client_id: z.string().min(1, 'Client Id is required'),
	redirect_uri: z.string().min(1, 'Redirect uri is required'),
	state: z.string().min(1, 'State is required')
});

export const connectApp = async (
	{
		client_id
	}: {
		client_id: string;
	},
	user: { username: string; id: string; isAdmin: boolean }
) => {
	const [app] = await db.select().from(application).where(eq(application.clientId, client_id));
	const [userApp] = await db
		.select()
		.from(userApplications)
		.where(and(eq(userApplications.applicationId, app.id), eq(userApplications.userId, user.id)));
	if (userApp) return userApp;

	const toinsert = {
		id: v7(),
		applicationId: app.id,
		userId: user.id
	};
	await db.insert(userApplications).values(toinsert);
	return toinsert;
};

export const getConnectAppDataFromRequest = async (request: Request) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	const result = schema.safeParse(data);

	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors };
	}
	return { data: result.data };
};
