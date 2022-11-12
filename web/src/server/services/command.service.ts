import { Command } from "@prisma/client";
import { prisma } from "../db/client";

interface GetCommandsParams {
  searchQuery?: string | undefined;
  userId?: string | undefined;
  teamId?: string | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
  limit?: number | undefined;
  includePrivate?: boolean;
}

interface CreateCommandsParams {
  content: string;
  description: string;
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
}: GetCommandsParams): Promise<Array<Command>> => {
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

  return await prisma.command.findMany(query);
};

export const create = async ({
  content,
  description,
  labels,
  userId,
  recipeId,
  teamId,
}: CreateCommandsParams): Promise<Command> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    content: content,
    description: description,
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

  return await prisma.command.create({ data: data });
};