import { router, publicProcedure } from "../trpc";
import { Command } from "@prisma/client";
import {prisma} from '../../db/client';
import { z } from "zod";

export const commandRouter = router({
  createCommand: publicProcedure
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
    .mutation(async ({ input, ctx}): Promise<Command | undefined> => {
      const { session } = ctx;

      if (!session?.user) return undefined;

      const {user} = session;

      return await prisma.command.create({
        data: {
          content: input.content,
          description: input.description,
          labels: {
            create: input.labels.map((label) => ({ content: label })),
          },
          private: input.private,
          user: {
            connect: {
              id: user.id
            }
          },
          recipe: {
            connect: {
              id: input.recipeId
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
    getPublicCommands: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      })
    )
    .query(async ({input}): Promise<Array<Command>> => {
      const includes = {
        include: {
          labels: true
        }
      }
      const searchQuery = (input.query && input.query !== "") ?  {
        where: {
          OR: {
            content: {
              search: input.query,
            },
            description: {
              search: input.query,
            },
         }
        }, 
        ...includes
      } : {...includes}
      return await prisma.command.findMany(
        searchQuery as any
      );
    }),
    addToRecipe: publicProcedure
    .input(
      z.object({
        commandId: z.string(),
        recipeId: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<Command | undefined> => {
      return await prisma.command.update({
        where: {
          id: input.commandId,
        },
        data: {
          recipe: {
            connect: {
              id: input.recipeId
            }
          }
        }
      })
    }),
    addToTeam: publicProcedure
    .input(
      z.object({
        commandId: z.string(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ input }): Promise<Command | undefined> => {
      return await prisma.command.update({
        where: {
          id: input.commandId,
        },
        data: {
          team: {
            connect: {
              id: input.teamId
            }
          }
        }
      })
    }),
});
