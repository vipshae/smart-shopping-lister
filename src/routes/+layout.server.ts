import type { LayoutServerLoad, RequestEvent } from './$types';

export const load: LayoutServerLoad = async (event: RequestEvent) => {
    const session = await event.locals.getSession();
    return { session };
};
