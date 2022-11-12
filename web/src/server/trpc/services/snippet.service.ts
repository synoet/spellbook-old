import { Snippet } from "@prisma/client";
import { prisma } from "../../db/client";

export const create = async (
  content: string,
  description: string,
  language: string,
  isPrivate: boolean,
  labels: Array<string>,
  userId: string,
  recipeId: string,
  teamId: string
): Promise<Snippet> => {
  const data: any = {
    content: content,
    private: isPrivate,
    description: description,
    language: language,
    labels: {
      create: labels.map((label) => ({ content: label })),
    },
    user: {
      connect: {
        id: userId,
      },
    },
  };

  if (recipeId) {
    data.recipe = {
      connect: {
        id: recipeId,
      },
    };
  }

  if (teamId) {
    data.team = {
      connect: {
        id: teamId,
      },
    };
  }

  return await prisma.snippet.create({ data: data });
};
