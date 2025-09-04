import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const earlyAccessEmails = sqliteTable("early_access_emails", {
  email: text("email").primaryKey(),
  createdAt: text("created_at").notNull(),
});

export type EarlyAccessEmail = typeof earlyAccessEmails.$inferSelect;
export type NewEarlyAccessEmail = typeof earlyAccessEmails.$inferInsert;


