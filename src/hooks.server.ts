import { dbConnect, dbDisconnect } from "$lib/mongo";
import type { HandleServerError } from '@sveltejs/kit';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Auth0Provider from '@auth/core/providers/auth0';
import type { Provider } from '@auth/core/providers';
import type { Handle } from '@sveltejs/kit';

dbConnect();

const config: SvelteKitAuthConfig = {
  providers: [
    Auth0Provider({
      id: 'auth0',
      name: 'Auth0',
      clientId: 'wqrbvEzrndd3YbxGjyngtVlQhAjlfm8I',
      clientSecret: '7kPumESByYAkZaMLpWXO3IKBjCkZkDaQqQ8VVQg6Toa_WiCNX1mrj6s4qJC_zo66',
      issuer: 'https://dev-gbfb4s87f7sycsdm.us.auth0.com/',  // <- remember to add trailing `/` 
      wellKnown: 'https://dev-gbfb4s87f7sycsdm.us.auth0.com/.well-known/openid-configuration'
    }) as Provider
  ],
  secret: '3fac457d82c150fc7595d7e47040b54f8966d9b2561d7a18162c2dc9384e899b',
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

