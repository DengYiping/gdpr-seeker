import { relations, sql } from "drizzle-orm";
import {
  index,
  primaryKey,
  sqliteTableCreator,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `gdpr-seeker_${name}`);

export const companies = createTable(
  "company",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 255 }).notNull(),
    domain: d.text({ length: 255 }).notNull(),
    gdprEmail: d.text({ length: 255 }).notNull(),
    verified: d.integer({ mode: "boolean" }).default(false).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("company_name_idx").on(t.name),
    uniqueIndex("company_domain_unique").on(t.domain),
  ],
);

export const users = createTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull(),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  image: d.text({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.text({ length: 255 }).notNull(),
    providerAccountId: d.text({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text({ length: 255 }),
    scope: d.text({ length: 255 }),
    id_token: d.text(),
    session_state: d.text({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.text({ length: 255 }).notNull(),
    token: d.text({ length: 255 }).notNull(),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const adminUsers = createTable("admin_users", (d) => ({
  userId: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
}));

export const gdprRequests = createTable(
  "gdpr_request",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    companyId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => companies.id),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    position: d.text({ length: 255 }).notNull(),
    firstName: d.text({ length: 255 }).notNull(),
    lastName: d.text({ length: 255 }).notNull(),
    applicantEmail: d.text({ length: 255 }).notNull(),
    phone: d.text({ length: 255 }).notNull(),
    dateOfBirth: d.text({ length: 255 }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("gdpr_request_company_idx").on(t.companyId),
    index("gdpr_request_user_idx").on(t.userId),
  ],
);

export const gdprRequestInterviews = createTable(
  "gdpr_request_interview",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    requestId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => gdprRequests.id),
    type: d.text({ length: 255 }).notNull(),
    time: d.text({ length: 255 }).notNull(),
  }),
  (t) => [index("gdpr_request_interview_request_idx").on(t.requestId)],
);

export const gdprRequestStates = createTable(
  "gdpr_request_state",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    requestId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => gdprRequests.id),
    state: d
      .text({ length: 64 })
      .notNull()
      .$type<"STARTED" | "RECEIVED" | "VERIFYING_PERSONAL_INFO" | "DONE">(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [index("gdpr_request_state_request_idx").on(t.requestId)],
);
