import { db } from "../index";
import { earlyAccessEmails, type EarlyAccessEmail } from "../schema";
import { eq } from "drizzle-orm";

export async function insertEarlyAccessEmail(email: string, createdAtIso: string): Promise<boolean> {
  const result = await db()
    .insert(earlyAccessEmails)
    .values({ email, createdAt: createdAtIso })
    .onConflictDoNothing();
  return Number(result.rowsAffected ?? 0) === 1;
}

export async function getEarlyAccessEmail(email: string): Promise<EarlyAccessEmail | undefined> {
  const rows: EarlyAccessEmail[] = await db()
    .select()
    .from(earlyAccessEmails)
    .where(eq(earlyAccessEmails.email, email));
  return rows[0];
}


