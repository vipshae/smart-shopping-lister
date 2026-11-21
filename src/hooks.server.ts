import { building } from "$app/env";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit/hooks";
import { getSessionCookie } from "better-auth/cookies";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { getAuth } from "#lib/server/auth-instance.js";
import type { AuthSession } from "#lib/server/auth.js";

export const handle: Handle = async ({ event, resolve }) => {
  let session: Promise<AuthSession | null> | undefined;
  event.locals.auth = () => {
    if (building || !getSessionCookie(event.request.headers)) {
      return Promise.resolve(null);
    }
    return (session ??= getAuth().then((auth) =>
      auth.api.getSession({ headers: event.request.headers }),
    ));
  };

  if (!building && event.url.pathname.startsWith("/auth/")) {
    return svelteKitHandler({
      auth: await getAuth(),
      event,
      resolve,
      building,
    });
  }

  if (
    event.url.pathname === "/home" ||
    event.url.pathname.startsWith("/home/") ||
    event.url.pathname === "/lists" ||
    event.url.pathname.startsWith("/lists/")
  ) {
    if (!(await event.locals.auth())?.user) redirect(303, "/login");
  }

  return resolve(event);
};
