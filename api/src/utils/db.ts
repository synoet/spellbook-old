import { PrismaClient } from '@prisma/client';

const DBClient = {
  instance: new PrismaClient(),
};

Object.freeze(DBClient);

export const {instance: prisma} = DBClient;
