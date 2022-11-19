import prisma from "../../utils/prisma";
import { CreateCommandSchema } from "./command.schema";

export const createCommand = async (command: CreateCommandSchema) => {
  return await prisma.command.create({
    data: {
      content: command.content,
      ...(command.description && { description: command.description }),
      ...(command.labels && {
        labels: {
          create: command.labels.map((label) => ({ content: label })),
        },
      }),
      user: {
        connect: {
          id: command.userId,
        },
      },
      ...(command.recipeId && {
        recipe: {
          connect: {
            id: command.recipeId,
          },
        },
      }),
      ...(command.teamId && {
        team: {
          connect: {
            id: command.recipeId,
          },
        },
      }),
    },
  } as any);
};
