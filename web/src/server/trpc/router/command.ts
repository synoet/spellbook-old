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

      })
    )
    .mutation(async ({ input }): Promise<Command> => {
      return await prisma.command.create(
        {
          data: {
            ...input
          },
      })
    }),
    getCommands: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      })
    )
    .query(async ({input}): Promise<Array<Command>> => {
      const searchQuery = (input.query && input.query !== "") ?  {
        where: {
          content: {
            search: input.query,
          },
          description: {
            search: input.query,
          }
        }} : {}
      return await prisma.command.findMany(searchQuery as any);
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
    searchCommands: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({input}) => {
      return await prisma.command.findMany({
        where: {
          content: {
            search: input.query,
          },
          description: {
            search: input.query,
          }
        }
      })

    })
});
