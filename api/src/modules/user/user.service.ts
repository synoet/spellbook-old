import prisma from "../../utils/prisma";

export const createUser = async ({ username, githubId, profileImage }: any) => {
  return await prisma.user.create({
    data: {
      username,
      githubId,
      profileImage,
    },
  });
};

export const getUserByGithubId = async (githubId: string) => {
  return await prisma.user.findUnique({
    where: {
      githubId,
    },
  });
};

export const getUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};
