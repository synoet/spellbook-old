import { FastifyInstance } from "fastify";
import { createCommandHandler } from "./command.controller";
import { $ref, CreateCommandSchema } from "./command.schema";

const commandRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: CreateCommandSchema;
  }>(
    "/",
    {
      schema: {
        body: $ref("createCommandSchema"),
        response: {
          201: $ref("createCommandResponseSchema"),
        },
      },
    },
    createCommandHandler
  );
};

export default commandRoutes;
