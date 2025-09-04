import { NextResponse } from "next/server";
import { db, getRawClient } from "@/db";
import { earlyAccessEmails, type EarlyAccessEmail } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function ensureSchema() {
  // Use raw SQL once to ensure table exists; Drizzle does not create tables automatically.
  await getRawClient().execute(
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
    const now = new Date().toISOString();

    // Try insert; ignore if exists
    const result = await getRawClient().execute({
      sql: "INSERT OR IGNORE INTO early_access_emails (email, created_at) VALUES (?1, ?2)",
      args: [email, now],
    });

    const created = Number(result?.rowsAffected ?? 0) === 1;

    const rows: EarlyAccessEmail[] = await db()
      .select()
      .from(earlyAccessEmails)
      .where(eq(earlyAccessEmails.email, email));
    const record = rows[0];
    return NextResponse.json(
      {
        ok: true,
        created,
        email: record?.email ?? email,
        createdAt: record?.createdAt ?? now,
      },
      { status: created ? 201 : 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


