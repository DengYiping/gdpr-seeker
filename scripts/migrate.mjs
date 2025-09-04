import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    console.error("Missing TURSO_DATABASE_URL env var");
    process.exit(1);
  }
  const isFile = url.startsWith("file:");
  const client = isFile ? createClient({ url }) : createClient({ url, authToken });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied successfully");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


