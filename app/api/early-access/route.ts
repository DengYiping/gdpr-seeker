import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Turso env vars missing: TURSO_DATABASE_URL/TURSO_AUTH_TOKEN");
  }
  return createClient({ url, authToken });
}

async function ensureSchema() {
  const client = await getClient();
  await client.execute(
    "CREATE TABLE IF NOT EXISTS early_access_emails (email TEXT PRIMARY KEY, created_at TEXT NOT NULL)"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await ensureSchema();
    const client = await getClient();

    const now = new Date().toISOString();
    const insert = await client.execute({
      sql: "INSERT OR IGNORE INTO early_access_emails (email, created_at) VALUES (?1, ?2)",
      args: [email, now],
    });

    const created = (insert as any)?.rowsAffected === 1;
    const row = await client.execute({
      sql: "SELECT email, created_at FROM early_access_emails WHERE email = ?1",
      args: [email],
    });

    const record = row.rows?.[0] as any;
    return NextResponse.json(
      {
        ok: true,
        created,
        email: record?.email ?? email,
        createdAt: record?.created_at ?? now,
      },
      { status: created ? 201 : 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}


