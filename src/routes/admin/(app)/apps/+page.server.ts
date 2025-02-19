import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { db } from "$lib/server/db";
import * as table from '$lib/server/db/schema';


export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
    if (!locals.user) {
        return redirect(302, '/admin/login');
    }
    const apps = await db.select().from(table.application);
    return { applications: apps };
};
