import {PrismaClient, User} from '@prisma/client'
import cuid from 'cuid'

export class UserService {
    prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
      this.prisma = prisma;
    }

    async get(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
          where: {
            id: id
          }
        });
    }

    async create(user: Partial<User>): Promise<User> {
        return await this.prisma.user.create({
          data: {
            id: cuid(),
            email: user.email!
          }
        });
    }

}