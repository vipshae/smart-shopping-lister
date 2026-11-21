import {
  betterAuth,
  type BetterAuthOptions,
  type BetterAuthPlugin,
} from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export interface AuthSettings {
  secret: string;
  baseURL?: string;
  issuer: string;
  clientId: string;
  clientSecret: string;
}

// The factory also lets the auth flow be tested with an isolated memory store.
export function createAuth(
  database: BetterAuthOptions["database"],
  settings: AuthSettings,
  cookiePlugin?: BetterAuthPlugin,
) {
  const issuer = settings.issuer.replace(/\/$/, "");
  return betterAuth({
    database,
    secret: settings.secret,
    baseURL: settings.baseURL,
    basePath: "/auth",
    advanced: { disableOriginCheck: false, disableCSRFCheck: false },
    // Dedicated collections avoid collisions with existing application data.
    user: { modelName: "auth_user" },
    session: { modelName: "auth_session", expiresIn: 1800, updateAge: 300 },
    account: { modelName: "auth_account" },
    verification: { modelName: "auth_verification" },
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "auth0",
            clientId: settings.clientId,
            clientSecret: settings.clientSecret,
            discoveryUrl: `${issuer}/.well-known/openid-configuration`,
            requireIdTokenVerification: true,
            scopes: ["openid", "profile", "email"],
            pkce: true,
            // Preserve the existing app-only sign-out behavior.
            disableProviderLogout: true,
          },
        ],
      }),
      ...(cookiePlugin ? [cookiePlugin] : []),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type AuthSession = Auth["$Infer"]["Session"];
