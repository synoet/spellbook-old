import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateCommandSchema,
  CreateCommandResponseSchema,
  GetAllCommandsSchema,
} from "./command.schema";
import { createCommand, getAllCommands } from "./command.service";

export const createCommandHandler = async (
  req: FastifyRequest<{ Body: CreateCommandSchema }>,
  rep: FastifyReply
) => {
  const command = await createCommand(req.body).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Creating Command");
  });
  rep.status(201).send(command);
};

export const getAllCommandsHandler = async (
  req: FastifyRequest<{ Querystring: GetAllCommandsSchema }>,
  rep: FastifyReply
) => {
  const response = await getAllCommands(req.query).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Getting Commands");
  });
  rep.status(200).send({
    commands: response,
    facets: req.query,
  });
};
