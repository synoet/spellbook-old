import Fastify, { FastifyInstance } from 'fastify';

import CommandController from './controllers/command.controller';
import { CommandService } from './services/command.service';
import DbClient from './db';

const app: FastifyInstance = Fastify({ logger: true });

const prisma = DbClient.instance;

CommandController(app, new CommandService(prisma));

app.listen(8000, (err, address) => {
  if (err) app.log.error(err)
  app.log.info(`server listening on ${address}`);
});
