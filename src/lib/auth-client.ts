import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({ basePath: "/auth" });

export async function signIn() {
  const { error } = await authClient.signIn.social({
    provider: "auth0",
    callbackURL: "/home",
    errorCallbackURL: "/login",
  });
  if (error) throw new Error(error.message ?? "Unable to sign in");
}

export async function signOut() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message ?? "Unable to sign out");
  window.location.assign("/");
}
