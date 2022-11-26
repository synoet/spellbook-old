import prisma from "../../utils/prisma";

export const createTeam = async (name: string, creatorId: string) => {
  return await prisma.team.create({
    data: {
      name: name,
      members: {
        create: {
          user: {
            connect: {
              id: creatorId,
            },
          },
          creator: true,
        },
      },
    },
  });
};

export const getTeam = async (id: string) => {
  return await prisma.team.findUnique({
    where: {
      id: id,
    },
    include: {
      members: true,
      commands: true,
      recipes: true,
      snippets: true,
    },
  });
};

export const addUserToTeam = async (teamId: string, userId: string) => {
  return await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      members: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });
};
