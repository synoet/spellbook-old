import { FastifyInstance } from "fastify";
import { authHandler, callbackHandler } from "./auth.controller";

const authRoutes = async (server: FastifyInstance) => {
  server.get<any>("/", {}, authHandler);
  server.get<any>("/callback", {}, callbackHandler);
};

export default authRoutes;
