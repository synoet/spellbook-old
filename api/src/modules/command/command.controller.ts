import {FastifyReply, FastifyRequest} from 'fastify';
import {
  getAll,
  get,
  create,
  update,
  deleteC,
  search,
} from './command.service';

import {
  GetCommandSchema,
  CreateCommandSchema,
  UpdateCommandSchema,
  SearchCommandsSchema
} from './command.schema';

export const getHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const commands = await getAll();

  reply.status(200).send(commands);
}

export const getOneHandler = async (
  request: FastifyRequest<{Params: GetCommandSchema}>,
  reply: FastifyReply,
) => {
  const {id} = request.params;
  const command = await get(id);

  reply.status(200).send(command);
}

export const createHandler = async (
  request: FastifyRequest<{Body: CreateCommandSchema}>,
  reply: FastifyReply,
) => {
  const {body} = request;

  const command = await create(body)
    .catch((error) => {
      console.log(error);
      reply.status(500).send("Failed to create command");
    })

  reply.status(201).send(command);
}

export const deleteHandler = async (
  request: FastifyRequest<{Params: GetCommandSchema}>,
  reply: FastifyReply,
) => {
  const {id} = request.params;

  await deleteC(id)
    .catch((error) => {
      console.log(error);
      reply.status(500).send("Failed to delete command");
    });

  reply.status(200).send(`Deleted command ${id}`);
}

export const updateHandler = async (
  request: FastifyRequest<{
    Params: GetCommandSchema,
    Body: UpdateCommandSchema,
  }>,
  reply: FastifyReply,
) => {
  const {id} = request.params;
  const {body} = request;

  const command = await update(id, body)
    .catch((error) => {
      console.log(error);
      reply.status(500).send("Failed to update command");
    });

  reply.status(201).send(command);
}

export const searchHandler = async (
  request: FastifyRequest<{Querystring: SearchCommandsSchema}>,
  reply: FastifyReply,
) => {
  const {q} = request.query;

  const commands = await search(q)
    .catch((error) => {
      console.log(error);
      reply.status(500).send("Failed to search commands");
    });

  reply.status(200).send(commands);
}

