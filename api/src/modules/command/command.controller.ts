import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateCommandSchema,
  GetAllCommandsSchema,
  GetCommandSchema,
} from "./command.schema";
import { createCommand, getAllCommands, getCommand } from "./command.service";

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

export const getCommandHandler = async (
  req: FastifyRequest<{ Params: GetCommandSchema }>,
  rep: FastifyReply
) => {
  const command = await getCommand(req.params.id).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Getting Command");
  });

  rep.status(200).send(command);
};
