import { and, desc, eq, max } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  companies,
  gdprRequestInterviews,
  gdprRequests,
  gdprRequestStates,
} from "~/server/db/schema";

export const gdprRequestRouter = createTRPCRouter({
  getMyLatest: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const rows = await ctx.db
      .select({
        firstName: gdprRequests.firstName,
        lastName: gdprRequests.lastName,
        phone: gdprRequests.phone,
        dateOfBirth: gdprRequests.dateOfBirth,
        createdAt: gdprRequests.createdAt,
      })
      .from(gdprRequests)
      .where(eq(gdprRequests.userId, userId))
      .orderBy(desc(gdprRequests.createdAt))
      .limit(1);
    if (!rows[0]) return null;
    const { firstName, lastName, phone, dateOfBirth } = rows[0];
    return { firstName, lastName, phone, dateOfBirth };
  }),
  create: protectedProcedure
    .input(
      z.object({
        companyId: z.number().int().positive(),
        position: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        applicantEmail: z.string().email(),
        phone: z.string().min(3),
        dateOfBirth: z.string().min(4),
        interviews: z
          .array(z.object({ type: z.string().min(1), time: z.string().min(1) }))
          .max(20)
          .default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [company] = await ctx.db
        .select()
        .from(companies)
        .where(
          and(eq(companies.id, input.companyId), eq(companies.verified, true)),
        )
        .limit(1);
      if (!company) {
        throw new Error("Company not found or not verified");
      }

      const inserted = await ctx.db
        .insert(gdprRequests)
        .values({
          companyId: input.companyId,
          userId,
          position: input.position,
          firstName: input.firstName,
          lastName: input.lastName,
          applicantEmail: input.applicantEmail,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth,
        })
        .returning({ id: gdprRequests.id });

      const created = inserted[0];
      if (!created) {
        throw new Error("Failed to create GDPR request");
      }
      const requestId = created.id;

      if (input.interviews.length > 0) {
        await ctx.db.insert(gdprRequestInterviews).values(
          input.interviews.map((iv) => ({
            requestId,
            type: iv.type,
            time: iv.time,
          })),
        );
      }

      // initialize state to STARTED
      await ctx.db.insert(gdprRequestStates).values({
        requestId,
        state: "STARTED",
      });

      return { id: requestId };
    }),
  getState: protectedProcedure
    .input(z.object({ requestId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          state: gdprRequestStates.state,
          createdAt: gdprRequestStates.createdAt,
        })
        .from(gdprRequestStates)
        .where(eq(gdprRequestStates.requestId, input.requestId))
        .orderBy(desc(gdprRequestStates.createdAt))
        .limit(1);
      return rows[0] ?? null;
    }),
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const maxCreatedAtSub = ctx.db
      .select({
        requestId: gdprRequestStates.requestId,
        maxCreatedAt: max(gdprRequestStates.createdAt).as("maxCreatedAt"),
      })
      .from(gdprRequestStates)
      .groupBy(gdprRequestStates.requestId)
      .as("maxCreatedAtSub");

    const rows = await ctx.db
      .select({
        id: gdprRequests.id,
        companyId: gdprRequests.companyId,
        position: gdprRequests.position,
        createdAt: gdprRequests.createdAt,
        companyName: companies.name,
        latestState: gdprRequestStates.state,
        latestStateAt: gdprRequestStates.createdAt,
      })
      .from(gdprRequests)
      .innerJoin(companies, eq(companies.id, gdprRequests.companyId))
      .innerJoin(
        gdprRequestStates,
        eq(gdprRequestStates.requestId, gdprRequests.id),
      )
      .innerJoin(
        maxCreatedAtSub,
        and(
          eq(gdprRequestStates.requestId, maxCreatedAtSub.requestId),
          eq(gdprRequestStates.createdAt, maxCreatedAtSub.maxCreatedAt),
        ),
      )
      .where(eq(gdprRequests.userId, userId));

    return rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      companyName: r.companyName,
      position: r.position,
      createdAt: r.createdAt,
      latestState: r.latestState,
      latestStateAt: r.latestStateAt,
    }));
  }),
});
