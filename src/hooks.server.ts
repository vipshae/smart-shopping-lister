import { dbConnect } from "$lib/mongo";
import { redirect, type Handle } from "@sveltejs/kit";
import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import Auth0Provider from "@auth/core/providers/auth0";
import type { Provider } from "@auth/core/providers";
import type { ServerInit } from "@sveltejs/kit";
import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  SVELTE_AUTH_CONFIG_SECRET,
} from "$env/static/private";
import { sequence } from "@sveltejs/kit/hooks";

// Connect to db using init hook
export const init: ServerInit = async () => {
  await dbConnect();
};

const config: SvelteKitAuthConfig = {
  providers: [
    Auth0Provider({
      id: "auth0",
      name: "Auth0",
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: "https://dev-gbfb4s87f7sycsdm.us.auth0.com/", // <- remember to add trailing `/`
      wellKnown:
        "https://dev-gbfb4s87f7sycsdm.us.auth0.com/.well-known/openid-configuration",
    }) as Provider,
  ],
  secret: SVELTE_AUTH_CONFIG_SECRET,
  debug: true,
  session: {
    maxAge: 1800, // 30 mins
  },
};

// Get the authentication handle from SvelteKitAuth
const { handle: authenticationHandle } = SvelteKitAuth(config);

// Middleware for protecting certain paths from unauth. access
const authorizeUser: Handle = async ({ event, resolve }) => {
  if (
    event.url.pathname.startsWith("/home") ||
    event.url.pathname.startsWith("/lists")
  ) {
    const session = await event.locals.auth();
    if (!session || !session?.user) throw redirect(303, "/login");
  }
  return resolve(event);
};

// chaining middlewares using sequence hook
export const handle: Handle = sequence(authenticationHandle, authorizeUser);
