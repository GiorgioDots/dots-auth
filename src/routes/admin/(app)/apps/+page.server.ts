import type { PageServerLoad } from "../$types";
import { db } from "$lib/server/db";
import * as table from '$lib/server/db/schema';


export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
    const apps = await db.select().from(table.application);
    return { applications: apps };
};
