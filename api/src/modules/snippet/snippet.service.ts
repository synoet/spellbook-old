import prisma from "../../utils/prisma";
import { CreateSnippetSchema, GetAllSnippetsSchema } from "./snippet.schema";

export const createSnippet = async (snippet: CreateSnippetSchema) => {
  return await prisma.snippet.create({
    data: {
      title: snippet.title,
      content: snippet.content,
      ...(snippet.description && { description: snippet.description }),
      ...(snippet.labels && {
        labels: {
          create: snippet.labels.map((label) => ({ content: label })),
        },
      }),
      user: {
        connect: {
          id: snippet.userId,
        },
      },
      ...(snippet.recipeId && {
        recipe: {
          connect: {
            id: snippet.recipeId,
          },
        },
      }),
      ...(snippet.teamId && {
        team: {
          connect: {
            id: snippet.recipeId,
          },
        },
      }),
    },
  } as any);
};

export const getAllSnippets = async (query: GetAllSnippetsSchema) => {
  return await prisma.snippet.findMany({
    where: {
      ...(query.ids && {
        id: {
          in: query.ids,
        },
      }),
      ...(query.labels && {
        labels: {
          some: {
            content: {
              in: query.labels,
            },
          },
        },
      }),
      ...(query.q && {
        OR: {
          content: {
            search: query.q,
          },
          description: {
            search: query.q,
          },
        },
      }),
    },
  });
};

export const getSnippet = async (id: string) => {
  return await prisma.snippet.findUnique({
    where: {
      id: id,
    },
    include: {
      labels: true,
      user: true,
      team: true,
      recipe: true,
    }
  });
};
