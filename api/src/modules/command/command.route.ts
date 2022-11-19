import { FastifyInstance } from "fastify";
import {
  createCommandHandler,
  getAllCommandsHandler,
} from "./command.controller";
import {
  $ref,
  CreateCommandSchema,
  GetAllCommandsSchema,
} from "./command.schema";

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

  server.get<{
    Querystring: GetAllCommandsSchema;
  }>(
    "/",
    {
      schema: {
        querystring: $ref("getAllCommandsSchema"),
        response: {
          200: $ref("getAllCommandsResponseSchema"),
        },
      },
    },
    getAllCommandsHandler
  );
};

export default commandRoutes;
