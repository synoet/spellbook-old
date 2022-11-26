import { FastifyInstance } from "fastify";
import {
  createTeamHandler,
  getTeamHandler,
  addUserToTeamHandler,
} from "./team.controller";

const teamRoutes = async (server: FastifyInstance) => {
  server.get<any>("/", {}, getTeamHandler);
  server.post<any>("/", {}, createTeamHandler);
  server.post<any>("/:id/user/add", {}, addUserToTeamHandler);
};

export default teamRoutes;
