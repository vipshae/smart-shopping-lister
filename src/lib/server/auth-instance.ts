import mongoose from "mongoose";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  SVELTE_AUTH_CONFIG_SECRET,
} from "$app/env/private";
import { dbConnect } from "#lib/mongo.js";
import { createAuth, type Auth } from "./auth.js";

let instance: Promise<Auth> | undefined;

export function getAuth(): Promise<Auth> {
  return (instance ??= initialize().catch((error) => {
    instance = undefined;
    throw error;
  }));
}

async function initialize(): Promise<Auth> {
  const secret = BETTER_AUTH_SECRET || SVELTE_AUTH_CONFIG_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET must be configured");
  await dbConnect();
  const client = mongoose.connection.getClient();
  return createAuth(
    mongodbAdapter(client.db(), { client }),
    {
      secret,
      baseURL: BETTER_AUTH_URL,
      issuer: AUTH0_ISSUER,
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
    },
    sveltekitCookies(getRequestEvent),
  );
}
