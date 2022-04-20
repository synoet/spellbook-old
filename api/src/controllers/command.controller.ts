import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import {Command} from '@prisma/client';
import {CommandService} from '../services/command.service';

export default async (app: FastifyInstance,  service: CommandService) => {
  // get all commands
  app.get("/commands", async (_: FastifyRequest, reply: FastifyReply) => {
    const commands = await service.getAll().catch((err: any) => {
      reply.status(500).send({
        error: err.message,
      });
    });

    if (!commands) {
      reply.status(404).send({
        error: "No commands found",
      });

    }
    reply.status(200).send(commands);
  });

  // get command by id
  app.get<{Params: {id: string}}>("/commands/:id", async (request, reply) => {
    if (!request.params.id) {
      reply.status(400).send({
        error: "No id provided",
      });
    }
    const command = await service.get(request.params.id).catch((err: any) => {
      reply.status(500).send({
        error: err.message,
      });
    });

    if (!command) {
      reply.status(404).send({
        error: "No command found",
      });
    }

    reply.status(200).send(command);
  });

  // create command
  app.post<{ Body: Partial<Command> }>("/commands/create", async (request: FastifyRequest, reply: FastifyReply) => {
    const command  = request.body as Partial<Command>;

    const newCommand = await service.create(command).catch((err: any) => {
      reply.status(500).send({
        error: err.message,
      });
    });

    reply.status(201).send(newCommand);
  });

  // update command
  app.patch<{ Body: Partial<Command> }>("/commands/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const command  = request.body as Partial<Command>;

    if (!command.content || !command.labels) {
      reply.status(400).send({
        error: "Command fields: content or  labels are required",
      });
    }

    const updatedCommand = await service.update(command).catch((err: any) => {
      reply.status(500).send({
        error: err.message,
      });
    });

    reply.status(200).send(updatedCommand);
  });

  interface IQuery {
    q: string,
  }

  app.get<{ Querystring: IQuery}>("/commands/search", async (request: FastifyRequest, reply: FastifyReply) => {
    const { q } = request?.query as IQuery;
    
    if (!q) {
      reply.status(400).send({
        error: "No query provided",
      });
    }
    const commands = await service.search(q).catch((err: any) => {
      reply.status(500).send({
        error: err.message,
      });
    });

    if (!commands) {
      reply.status(404).send({
        error: "No commands found",
      });
    }

    reply.status(200).send(commands);
  });

}
