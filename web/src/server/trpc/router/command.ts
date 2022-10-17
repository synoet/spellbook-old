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
        labels: z.array(z.string()).optional().default([])
      })
    )
    .mutation(async ({ input }): Promise<Command> => {
      const command = await prisma.command.create(
        {
          data: {
            content: input.content,
            description: input.description,
            labels: {
              create: input.labels.map((label) => ({ content: label })),
            }
          },
      })

      return command;
    }),
    getCommands: publicProcedure
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
    deleteCommand: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }): Promise<Command> => {
      return await prisma.command.delete({
        where: {
          id: input.id
        }
      })
    }),
});
