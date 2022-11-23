
import { FastifyInstance } from "fastify";
import { snippetSchemas } from "./snippet.schema";
import snippetRoutes from "./snippet.route";

export const attachSnippetRoutes = (server: FastifyInstance) => {
  for (const schema of snippetSchemas) {
    server.addSchema(schema);
  }

  server.register(snippetRoutes, { prefix: "/api/snippet" });
};
