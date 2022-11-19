import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCommandSchema } from "./command.schema";
import { createCommand } from "./command.service";

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
  req: FastifyRequest,
  rep: FastifyReply
 ) => {

}