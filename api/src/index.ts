import Fastify, { FastifyInstance } from 'fastify';

import CommandController from './controllers/command.controller';
import UserController from './controllers/user.controller';
import { CommandService } from './services/command.service';
import { UserService } from './services/user.service';
import DbClient from './db';

const app: FastifyInstance = Fastify({ logger: true });

const prisma = DbClient.instance;

CommandController(app, new CommandService(prisma));
UserController(app, new UserService(prisma))


app.listen(8000, (err, address) => {
  if (err) app.log.error(err)
  app.log.info(`server listening on ${address}`);
});
