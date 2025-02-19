import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}
	return { user: locals.user };
};
