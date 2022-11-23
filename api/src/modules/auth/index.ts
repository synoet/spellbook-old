import {FastifyInstance} from "fastify";  
import authRoutes from "./auth.route";

export const attachAuthRoutes = (server: FastifyInstance) => {
  server.register(authRoutes, { prefix: "/api/auth" });
}