import { Command } from '@prisma/client'
import { prisma } from "../../db/client";

export const get = async (
  searchQuery?: string | undefined,
  userId?: string | undefined,
  teamId?: string | undefined,
  from?: Date | undefined,
  to?: Date | undefined,
  limit?: number | undefined,
  includePrivate = false,
): Promise<Array<Command>> => {
  const includes = {
    include: {
      labels: true,
    }
  }

  const query: any = {
    ...includes,
    where: {
      private: includePrivate,
    }
  }

  if (searchQuery && searchQuery !== '') {
    query.where = {
      OR: {
        content: {
          search: searchQuery,
        },
        description: {
          search: searchQuery,
        },
      },
    }
  }

  if (userId) {
    query.where = {
      ...query.where,
      userId: userId,
    }
  }

  if (teamId) {
    query.where = {
      ...query.where,
      teamId: teamId,
    }
  }

  if (from || to) {
    query.where = {
      ...query.where,
      createdAt: {
        gte: from || 0,
        lte: to || new Date(),
      }
    }
  }

  if (limit) {
    query.limit = limit
  }


  return await prisma.command.findMany(query);
}