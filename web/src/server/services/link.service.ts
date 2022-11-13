import { Link } from "@prisma/client";
import { prisma } from "../db/client";

interface CreateLinkParams {
  linkId: string;
  content: string;
  title: string;
  userId: string;
  type: string;
  visibility: string;
}

export const create = async ({
  linkId,
  content,
  title,
  userId,
  type,
  visibility,
}: CreateLinkParams): Promise<Link> => {
  return await prisma.link.create({
    data: {
      linkId: linkId ,
      title: title,
      type: type,
      visibility: visibility,
      content: content,
      user: {
        connect: {
          id: userId,
        }
      }
    },
  });
};

export const getOne = async (linkId: string): Promise<Link | null> => {
  return await prisma.link.findUnique({
    where: {
      linkId: linkId,
    },
    include: {
      user: true,
    }
  });
};
