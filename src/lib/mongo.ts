import mongoose from "mongoose";
import { MONGODB_URI } from "$app/env/private";

let connection: Promise<typeof mongoose> | undefined;

export async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await (connection ??= mongoose.connect(MONGODB_URI).catch((error) => {
    connection = undefined;
    throw error;
  }));
}

export async function dbDisconnect(): Promise<void> {
  await mongoose.disconnect();
  connection = undefined;
}
