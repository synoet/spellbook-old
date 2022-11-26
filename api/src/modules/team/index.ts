import {FastifyInstance} from "fastify";  
import teamRoutes from "./team.route";

export const attachTeamRoutes = (server: FastifyInstance) => {
  server.register(teamRoutes, { prefix: "/api/team" });
}