import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { config } from "dotenv";

config({ path: ".env" });

let cachedClient: Client | undefined;
let cachedDb: LibSQLDatabase | undefined;

export function getLibsqlClient(): Client {
  const url = process.env.TURSO_CONNECTION_URL ?? process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Turso env vars missing: TURSO_CONNECTION_URL or TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");
  }
  return createClient({ url, authToken });
}

export function getRawClient(): Client {
  if (!cachedClient) {
    cachedClient = getLibsqlClient();
  }
  return cachedClient;
}

export function db(): LibSQLDatabase {
  if (!cachedDb) {
    cachedDb = drizzle(getRawClient());
  }
  return cachedDb;
}
