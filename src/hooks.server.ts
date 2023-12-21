import { dbConnect, dbDisconnect } from "$lib/mongo";
import type { HandleServerError } from '@sveltejs/kit';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Auth0Provider from '@auth/core/providers/auth0';
import type { Provider } from '@auth/core/providers';
import type { Handle } from '@sveltejs/kit';
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, SVELTE_AUTH_CONFIG_SECRET } from '$env/static/private';

dbConnect();

const config: SvelteKitAuthConfig = {
  providers: [
    Auth0Provider({
      id: 'auth0',
      name: 'Auth0',
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: 'https://dev-gbfb4s87f7sycsdm.us.auth0.com/',  // <- remember to add trailing `/` 
      wellKnown: 'https://dev-gbfb4s87f7sycsdm.us.auth0.com/.well-known/openid-configuration'
    }) as Provider
  ],
  secret: SVELTE_AUTH_CONFIG_SECRET,
  debug: true,
  session: {
    maxAge: 1800 // 30 mins
  }
};

export const handle = SvelteKitAuth(config) satisfies Handle;

// export const handleError: HandleServerError = ({ error, event }) => {
//     return {
//         message: `Server Error: ${error.message}`,
//         code: error?.code ?? 'UNKNOWN'
//     };
// };

