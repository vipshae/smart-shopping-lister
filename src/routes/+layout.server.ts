import type { LayoutServerLoad, RequestEvent } from './$types';
import { SIGNOUT_CALLBACKURL, SIGNIN_CALLBACKURL } from '$env/static/private';

export const load: LayoutServerLoad = async (event: RequestEvent) => {
    const session = await event.locals.getSession();
    return { session, SIGNOUT_CALLBACKURL, SIGNIN_CALLBACKURL };
};
