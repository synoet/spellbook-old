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
    .mutation(async ({ input }): Promise<Command> => {
      const createInput: any = {
        data: {
          content: input.content,
          description: input.description,
          labels: {
            create: input.labels.map((label) => ({ label })),
          },
          private: input.private,
        }
      }

      if (input.recipeId) {
        createInput.data.recipe = {
          connect: {
            id: input.recipeId
          }
        }
      }

      if (input.teamId){
        createInput.data.team = {
          connect: {
            id: input.teamId
          }
        }
      }

      return await prisma.command.create(createInput)
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
});
