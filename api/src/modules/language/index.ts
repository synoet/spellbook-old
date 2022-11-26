import { FastifyInstance } from "fastify";
import { languageRoutes } from "./language.route";

export const attachLanguageRoutes = (server: FastifyInstance) => {
  server.register(languageRoutes, { prefix: "/api/language" });
};
