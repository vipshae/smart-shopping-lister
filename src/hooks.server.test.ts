import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";
import type { Auth } from "#lib/server/auth.js";

vi.mock("$app/env", () => ({ building: false }));
vi.mock("#lib/server/auth-instance.js", () => ({ getAuth: vi.fn() }));

import { getAuth } from "#lib/server/auth-instance.js";
import { handle } from "./hooks.server.js";
import { load } from "./routes/+layout.server.js";

function event(path: string, cookie = ""): RequestEvent {
  const url = new URL(path, "https://shopping.example");
  return {
    url,
    request: new Request(url, { headers: { cookie } }),
    locals: {},
  } as RequestEvent;
}

beforeEach(() => vi.resetAllMocks());

describe("SvelteKit authentication hook", () => {
  it.each(["/", "/login"])(
    "renders %s anonymously without connecting to the auth database",
    async (path) => {
      const requestEvent = event(path);
      const resolve = vi.fn(async () => new Response("page"));
      const response = await handle({ event: requestEvent, resolve });
      expect(response.status).toBe(200);
      expect(await requestEvent.locals.auth()).toBeNull();
      expect(getAuth).not.toHaveBeenCalled();
    },
  );

  it.each(["/home", "/lists", "/lists/Weekly"])(
    "protects %s without a session",
    async (path) => {
      const resolve = vi.fn(async () => new Response("private"));
      await expect(
        handle({ event: event(path), resolve }),
      ).rejects.toMatchObject({ status: 303, location: "/login" });
      expect(resolve).not.toHaveBeenCalled();
    },
  );

  it("reads a valid session once per request and excludes its token from page data", async () => {
    const session = {
      user: {
        id: "user-id",
        email: "shopper@example.com",
        name: "Shopper",
        image: null,
      },
      session: {
        token: "private-session-token",
        expiresAt: new Date("2030-01-01"),
      },
    };
    const getSession = vi.fn(async () => session);
    vi.mocked(getAuth).mockResolvedValue({
      api: { getSession },
    } as unknown as Auth);
    const requestEvent = event(
      "/lists",
      "__Secure-better-auth.session_token=signed-token",
    );
    const resolve = vi.fn(async () => new Response("private"));
    expect((await handle({ event: requestEvent, resolve })).status).toBe(200);
    expect(await requestEvent.locals.auth()).toBe(session);
    expect(getSession).toHaveBeenCalledTimes(1);
    const pageData = await load(requestEvent as Parameters<typeof load>[0]);
    expect(pageData?.session?.user.email).toBe("shopper@example.com");
    expect(JSON.stringify(pageData)).not.toContain("private-session-token");
  });

  it("passes auth requests to Better Auth without consuming their cookies or body", async () => {
    const response = new Response("auth response", {
      status: 200,
      headers: { "set-cookie": "test=value; HttpOnly; Secure" },
    });
    const handler = vi.fn(async () => response);
    vi.mocked(getAuth).mockResolvedValue({
      handler,
      options: { basePath: "/auth" },
    } as unknown as Auth);
    const requestEvent = event("/auth/get-session");
    const resolve = vi.fn(async () => new Response("page"));
    expect(await handle({ event: requestEvent, resolve })).toBe(response);
    expect(handler).toHaveBeenCalledWith(requestEvent.request);
    expect(resolve).not.toHaveBeenCalled();
  });
});
