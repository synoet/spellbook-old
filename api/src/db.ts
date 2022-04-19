import { PrismaClient } from '@prisma/client';

const DBClient = {
  instance: new PrismaClient(),
};

export type IDBClient = typeof DBClient;

Object.freeze(DBClient);

export default DBClient;
