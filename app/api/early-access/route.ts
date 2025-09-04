import { NextResponse } from "next/server";
import { type EarlyAccessEmail } from "@/db/schema";
import { insertEarlyAccessEmail, getEarlyAccessEmail } from "@/db/queries/earlyAccess";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const now = new Date().toISOString();

    const created = await insertEarlyAccessEmail(email, now);
    const record: EarlyAccessEmail | undefined = await getEarlyAccessEmail(email);
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


