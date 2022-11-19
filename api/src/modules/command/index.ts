import { FastifyInstance } from "fastify";
import { commandSchemas } from "./command.schema";
import commandRoutes from "./command.route";

export const attachCommandRoutes = (server: FastifyInstance) => {
  for (const schema of commandSchemas) {
    server.addSchema(schema);
  }

  server.register(commandRoutes, { prefix: "/api/command" });
};
