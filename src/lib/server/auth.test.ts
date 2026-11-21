import { generateKeyPairSync, sign } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { memoryAdapter } from "better-auth/adapters/memory";
import { createAuth } from "./auth.js";

const origin = "https://shopping.example";
const issuer = "https://tenant.example/";
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
const jwk = {
  ...publicKey.export({ format: "jwk" }),
  kid: "test",
  alg: "RS256",
  use: "sig",
};
let nonce = "";

function idToken() {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const payload = `${encode({ alg: "RS256", kid: "test" })}.${encode({
    iss: issuer,
    aud: "test-client",
    sub: "auth0|shopper",
    nonce,
    email: "shopper@example.com",
    email_verified: true,
    name: "Shopper",
    iat: now,
    exp: now + 3600,
  })}`;
  return `${payload}.${sign("RSA-SHA256", Buffer.from(payload), privateKey).toString("base64url")}`;
}

function fixture() {
  const store = {
    auth_user: [],
    auth_session: [],
    auth_account: [],
    auth_verification: [],
  };
  const auth = createAuth(memoryAdapter(store), {
    secret: "test-only-secret-with-at-least-thirty-two-characters",
    baseURL: origin,
    issuer,
    clientId: "test-client",
    clientSecret: "test-secret",
  });
  let cookies = new Map<string, string>();
  async function request(path: string, body?: unknown, requestOrigin = origin) {
    const headers = new Headers({
      cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; "),
    });
    if (body) {
      headers.set("content-type", "application/json");
      headers.set("origin", requestOrigin);
    }
    const response = await auth.handler(
      new Request(`${origin}/auth${path}`, {
        method: body ? "POST" : "GET",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
    for (const header of response.headers.getSetCookie()) {
      const pair = header.split(";")[0];
      const separator = pair.indexOf("=");
      const name = pair.slice(0, separator);
      const value = pair.slice(separator + 1);
      if (value) cookies.set(name, value);
      else cookies.delete(name);
    }
    return response;
  }
  return {
    auth,
    store,
    request,
    clearCookies() {
      cookies = new Map();
    },
  };
}

beforeEach(() => {
  nonce = "";
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url === `${issuer}.well-known/openid-configuration`) {
        return Response.json({
          issuer,
          authorization_endpoint: `${issuer}authorize`,
          token_endpoint: `${issuer}oauth/token`,
          userinfo_endpoint: `${issuer}userinfo`,
          jwks_uri: `${issuer}.well-known/jwks.json`,
          response_types_supported: ["code"],
          subject_types_supported: ["public"],
          id_token_signing_alg_values_supported: ["RS256"],
        });
      }
      if (url === `${issuer}.well-known/jwks.json`)
        return Response.json({ keys: [jwk] });
      if (url === `${issuer}oauth/token`)
        return Response.json({
          access_token: "test-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          id_token: idToken(),
        });
      throw new Error(`Unexpected outbound request: ${url}`);
    }),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("Better Auth / Auth0 migration", () => {
  it("keeps the existing callback URL and completes OIDC login, session reads and logout", async () => {
    const { request, store } = fixture();
    expect(await (await request("/get-session")).json()).toBeNull();
    const start = await request("/sign-in/social", {
      provider: "auth0",
      callbackURL: "/home",
    });
    expect(start.status).toBe(200);
    const authorization = new URL((await start.json()).url);
    expect(authorization.origin).toBe(new URL(issuer).origin);
    expect(authorization.searchParams.get("client_id")).toBe("test-client");
    expect(authorization.searchParams.get("redirect_uri")).toBe(
      `${origin}/auth/callback/auth0`,
    );
    expect(authorization.searchParams.get("code_challenge_method")).toBe(
      "S256",
    );
    expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
    expect(authorization.searchParams.get("scope")).toContain("email");
    nonce = authorization.searchParams.get("nonce") ?? "";
    expect(nonce).toBeTruthy();
    const state = authorization.searchParams.get("state");
    expect(state).toBeTruthy();
    const callback = await request(
      `/callback/auth0?code=test-code&state=${encodeURIComponent(state!)}`,
    );
    expect(callback.status).toBe(302);
    expect(new URL(callback.headers.get("location")!, origin).pathname).toBe(
      "/home",
    );
    expect(
      callback.headers
        .getSetCookie()
        .some((cookie) => /HttpOnly/i.test(cookie) && /Secure/i.test(cookie)),
    ).toBe(true);
    const session = await (await request("/get-session")).json();
    expect(session.user.email).toBe("shopper@example.com");
    expect(store.auth_user).toHaveLength(1);
    expect(store.auth_session).toHaveLength(1);
    expect((await request("/sign-out", {})).status).toBe(200);
    expect(await (await request("/get-session")).json()).toBeNull();
    expect(store.auth_session).toHaveLength(0);
  });

  it("rejects a cross-origin sign-in request", async () => {
    const { request } = fixture();
    const response = await request(
      "/sign-in/social",
      { provider: "auth0", callbackURL: "/home" },
      "https://evil.example",
    );
    expect(response.status).toBe(403);
  });

  it("rejects an untrusted post-login redirect", async () => {
    const { request } = fixture();
    const response = await request("/sign-in/social", {
      provider: "auth0",
      callbackURL: "https://evil.example",
    });
    expect(response.status).toBe(403);
  });

  it("rejects an OAuth callback without matching state and creates no session", async () => {
    const { request, store } = fixture();
    const response = await request(
      "/callback/auth0?code=test-code&state=invalid",
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("error=");
    expect(store.auth_session).toHaveLength(0);
  });

  it("rejects an ID token with the wrong nonce", async () => {
    const { request, store } = fixture();
    const start = await request("/sign-in/social", {
      provider: "auth0",
      callbackURL: "/home",
    });
    const authorization = new URL((await start.json()).url);
    nonce = "a-different-nonce";
    const response = await request(
      `/callback/auth0?code=test-code&state=${encodeURIComponent(authorization.searchParams.get("state")!)}`,
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("error=");
    expect(store.auth_session).toHaveLength(0);
  });
});
