import prisma from "../../utils/prisma";
import { CreateCommandSchema } from "./command.schema";

export const createCommand = async (command: CreateCommandSchema) => {
  return await prisma.command.create({
    data: {
      content: command.content,
      description: command.description,
      labels: command.labels,
      ...(command.userId && {
        user: {
          connect: {
            id: command.userId,
          },
        },
      }),
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
  });
};
