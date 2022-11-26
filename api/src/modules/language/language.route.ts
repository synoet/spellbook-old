import { FastifyInstance } from "fastify";
import { detectHandler } from "./language.controller";

export const languageRoutes = async (server: FastifyInstance) => {
  server.get<any>("/detect", {}, detectHandler);
}