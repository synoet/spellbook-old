import {Command} from '@prisma/client'
import {prisma} from '../../db';
import {stringRankSearch} from '../../utils/search';
import cuid from 'cuid'

import {
  UpdateCommandSchema,
  CreateCommandSchema,
} from './command.schema';

export const getAll = async (): Promise<Array<Command>> => {
  return await prisma.command.findMany({});
};

export const get = async (id: string): Promise<Command | null> => {
  return await prisma.command.findUnique({
    where: {
      id: id
    }
  });
}

export const update = async (id: string, command: UpdateCommandSchema): Promise<Command> => {
  const oldCommand = await prisma.command.findUnique({
    where: {
      id: id
    }
  });

  return await prisma.command.update({
    where: {
      id: id
    },
    data: {
      ...command,
      updatedAt: new Date(),
      ...oldCommand,
    }
  });
}

export const create = async (command: CreateCommandSchema): Promise<Command> => {
  return await prisma.command.create({
    data: {
      ...command,
      id: cuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
}

export const deleteC = async (id: string): Promise<boolean> => {
  await prisma.command.delete({
    where: {
      id: id
    }
  }).catch((error) => {
    console.error(error);
    return false;
  });

  return true;
};

export const search = async (query: string): Promise<Array<Command>> => {
  return stringRankSearch(query, await getAll());
}
