import { Snippet } from "@prisma/client";
import { prisma } from "../db/client";

interface GetSnippetsParams {
  searchQuery?: string;
  userId?: string;
  teamId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  includePrivate?: boolean;
}

interface CreateSnippetsParams {
  content: string;
  description: string;
  language: string;
  isPrivate?: boolean;
  labels: Array<string>;
  userId: string;
  recipeId?: string;
  teamId?: string;
}

export const get = async ({
  searchQuery,
  userId,
  teamId,
  from,
  to,
  limit,
  includePrivate,
}: GetSnippetsParams): Promise<Array<Snippet>> => {
  const includes = {
    include: {
      labels: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    ...includes,
    where: {
      private: includePrivate,
    },
  };

  if (searchQuery && searchQuery !== "") {
    query.where = {
      OR: {
        content: {
          search: searchQuery,
        },
        description: {
          search: searchQuery,
        },
      },
    };
  }

  if (userId) {
    query.where = {
      ...query.where,
      userId: userId,
    };
  }

  if (teamId) {
    query.where = {
      ...query.where,
      teamId: teamId,
    };
  }

  if (from || to) {
    query.where = {
      ...query.where,
      createdAt: {
        gte: from || 0,
        lte: to || new Date(),
      },
    };
  }

  if (limit) {
    query.limit = limit;
  }

  return await prisma.snippet.findMany(query);
};

export const create = async ({
  content,
  description,
  language,
  isPrivate,
  labels,
  userId,
  recipeId,
  teamId,
}: CreateSnippetsParams): Promise<Snippet> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
