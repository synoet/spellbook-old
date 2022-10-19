import { router, publicProcedure } from "../trpc";
import { Recipe } from "@prisma/client";
import {prisma} from '../../db/client';
import { z } from "zod";

export const recipeRouter = router({
  createRecipe: publicProcedure
    .input(
      z.object({
        title: z.string(),
        private: z.boolean().optional().default(false),
        teamId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx}): Promise<Recipe | undefined> => {
      const { session } = ctx;

      if (!session?.user) return;

      const {user} = session;

      return await prisma.recipe.create({
        data: {
          title: input.title,
          private: input.private,
          user: {
            connect: {
              id: user.id
            }
          },
          team: {
            connect: {
              id: input.teamId
            }
          }
        }
      })
    }),
});
