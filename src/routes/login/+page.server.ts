import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { SIGNOUT_CALLBACKURL, SIGNIN_CALLBACKURL } = await parent();
  return { SIGNOUT_CALLBACKURL, SIGNIN_CALLBACKURL };
};
