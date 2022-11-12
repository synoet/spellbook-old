import { router, publicProcedure } from "../trpc";
import { Command } from "@prisma/client";
import { z } from "zod";

import { get, create } from "../../services/command.service";

export const commandRouter = router({
  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        description: z.string(),
        labels: z.array(z.string()).optional().default([]),
        recipeId: z.string().optional(),
        teamId: z.string().optional(),
        private: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input, ctx }): Promise<Command | undefined> => {
      const { session } = ctx;

      if (!session?.user) return undefined;

      const { user } = session;

      return await create({
        content: input.content,
        description: input.description,
        labels: input.labels,
        userId: user.id,
        recipeId: input.recipeId,
        teamId: input.teamId,
      });
    }),
  get: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      })
    )
    .query(async ({ input }): Promise<Array<Command>> => {
      return await get({
        searchQuery: input.query,
      });
    }),
});
