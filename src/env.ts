import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  MONGODB_URI: {},
  AUTH0_CLIENT_ID: {},
  AUTH0_CLIENT_SECRET: {},
  AUTH0_ISSUER: {
    schema: (value) => value || "https://dev-gbfb4s87f7sycsdm.us.auth0.com/",
  },
  BETTER_AUTH_URL: { schema: (value) => value || undefined },
  BETTER_AUTH_SECRET: { schema: (value) => value || undefined },
  // Existing deployments can keep their current secret during the transition.
  SVELTE_AUTH_CONFIG_SECRET: { schema: (value) => value || undefined },
  HUGGINGFACE_API_KEY: {},
});
