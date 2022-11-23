import { FastifyInstance } from "fastify";
import {
  getAllSnippetsHandler,
  getSnippetHandler,
  createSnippetHandler,
} from "./snippet.controller";
import {
  $ref,
  CreateSnippetSchema,
  GetAllSnippetsSchema,
  GetSnippetSchema,
} from "./snippet.schema";

const snippetRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: CreateSnippetSchema;
  }>(
    "/",
    {
      schema: {
        body: $ref("createSnippetSchema"),
        response: {
          201: $ref("createSnippetResponseSchema"),
        },
      },
    },
    createSnippetHandler
  );

  server.get<{
    Querystring: GetAllSnippetsSchema;
  }>(
    "/",
    {
      schema: {
        querystring: $ref("getAllSnippetsSchema"),
        response: {
          200: $ref("getAllSnippetsResponseSchema"),
        },
      },
    },
    getAllSnippetsHandler
  );

  server.get<{
    Params: GetSnippetSchema;
  }>("/:id", {}, getSnippetHandler);
};

export default snippetRoutes;
