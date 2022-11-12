import { router, publicProcedure } from "../trpc";
import { Snippet } from "@prisma/client";
import { z } from "zod";
import { get, getOne, create } from "../../services/snippet.service";

export const snippetRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        description: z.string(),
        language: z.string(),
        labels: z.array(z.string()).optional().default([]),
        recipeId: z.string().optional(),
        teamId: z.string().optional(),
        private: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input, ctx }): Promise<Snippet | undefined> => {
      const { session } = ctx;

      const {
        title,
        content,
        description,
        language,
        labels,
        recipeId,
        teamId,
        private: isPrivate,
      } = input;

      if (!session?.user) return undefined;

      const { user } = session;

      return await create({
        title: title,
        content: content,
        description: description,
        language: language,
        labels: labels,
        recipeId: recipeId,
        teamId: teamId,
        userId: user.id,
        isPrivate: isPrivate,
      });
    }),
  get: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      })
    )
    .query(async ({ input }): Promise<Array<Snippet>> => {
      return await get({
        searchQuery: input.query,
      });
    }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }): Promise<Snippet | null> => {
      return await getOne(input.id);
    }),
});
