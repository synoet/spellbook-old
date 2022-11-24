import { FastifyInstance } from "fastify";
import { authHandler, callbackHandler, whoamiHandler} from "./auth.controller";

const authRoutes = async (server: FastifyInstance) => {
  server.get<any>("/", {}, authHandler);
  server.get<any>("/callback", {}, callbackHandler);
  server.get<any>("/whoami", {}, whoamiHandler);
};

export default authRoutes;
