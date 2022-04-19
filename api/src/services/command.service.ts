import {PrismaClient, Command} from '@prisma/client'
import cuid from 'cuid'

import {stringRankSearch} from '../utils/search';

export class CommandService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Array<Command>> {
    return await this.prisma.command.findMany({});
  }

  async get(id: string): Promise<Command | null> {
    return await this.prisma.command.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(command: Partial<Command>): Promise<Command> {
    const oldCommand = await this.prisma.command.findUnique({
      where: {
        id: command.id
      }
    });
    return await this.prisma.command.update({
      where: {
        id: command.id
      },
      data: {
        ...command,
        ...oldCommand,
      }
    });
  }

  async create(command: Partial<Command>): Promise<Command> {
    return await this.prisma.command.create({
      data: {
        id: cuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        content: command.content || '',
        description: command.description || '',
        labels: command.labels,
      }
    });
  }

  async delete(id: string): Promise<Command> {
    return await this.prisma.command.delete({
      where: {
        id: id
      }
    });
  }

  async search(query: string): Promise<Array<Command>> {
    return stringRankSearch(query, await this.getAll());
  }
}
