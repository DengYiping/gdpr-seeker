import { and, eq, like, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { adminUsers, companies } from "~/server/db/schema";

export const companyRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.db
        .select()
        .from(companies)
        .where(and(eq(companies.id, input.id), eq(companies.verified, true)))
        .limit(1);
      return row[0] ?? null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        domain: z.string().min(1),
        gdprEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const inserted = await ctx.db
        .insert(companies)
        .values({
          name: input.name,
          domain: input.domain,
          gdprEmail: input.gdprEmail,
          verified: false,
        })
        .returning();
      return inserted[0] ?? null;
    }),
  listUnverified: protectedProcedure.query(async ({ ctx }) => {
    // admin-only
    const userId = ctx.session.user.id;
    const isAdmin = await ctx.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId))
      .limit(1);
    if (isAdmin.length === 0) {
      throw new Error("UNAUTHORIZED");
    }
    return ctx.db.select().from(companies).where(eq(companies.verified, false));
  }),
  verify: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const isAdmin = await ctx.db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);
      if (isAdmin.length === 0) {
        throw new Error("UNAUTHORIZED");
      }
      await ctx.db
        .update(companies)
        .set({ verified: true })
        .where(eq(companies.id, input.id));
      return { ok: true };
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const isAdmin = await ctx.db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);
      if (isAdmin.length === 0) {
        throw new Error("UNAUTHORIZED");
      }
      await ctx.db.delete(companies).where(eq(companies.id, input.id));
      return { ok: true };
    }),
  searchByName: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().int().positive().max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pattern = `%${input.query}%`;
      const rows = await ctx.db
        .select()
        .from(companies)
        .where(and(like(companies.name, pattern), eq(companies.verified, true)))
        .orderBy(sql`instr(${companies.name}, ${input.query})`)
        .limit(input.limit);

      return rows;
    }),
});
