import { Link } from "@prisma/client";
import { prisma } from "../db/client";

interface CreateLinkParams {
  id: string;
  content: string;
  title: string;
  userId: string;
  type: string;
  visibility: string;
}

export const create = async ({
  id,
  content,
  title,
  userId,
  type,
  visibility,
}: CreateLinkParams): Promise<Link> => {
  return await prisma.link.create({
    data: {
      id: id,
      title: title,
      type: type,
      visibility: visibility,
      content: content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const getOne = async (id: string): Promise<any | null> => {
  return await prisma.link.findMany({
    where: {
      linkId: id,
    },
    include: {
      user: true,
    }
  });
};
