import { FastifyRequest, FastifyReply } from "fastify";
import { createTeam, getTeam, addUserToTeam } from "./team.service";

export const createTeamHandler = async (
  req: FastifyRequest<{ Body: { name: string; creatorId: string } }>,
  rep: FastifyReply
) => {
  const { name, creatorId } = req.body;
  const team = await createTeam(name, creatorId).catch((error) => {
    console.log(error);
    rep.status(500).send("Failed to create tam");
  });

  return rep.status(201).send(team);
};

export const getTeamHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply
) => {
  const { id } = req.params;
  const team = await getTeam(id).catch((error) => {
    console.log(error);
    rep.status(500).send("Failed to get team");
  });

  return rep.status(200).send(team);
};

export const addUserToTeamHandler = async (
  req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>,
  rep: FastifyReply
) => {
  await addUserToTeam(req.params.id, req.body.userId).catch((error) => {
    console.log(error);
    rep.status(500).send("Failed to add user to team");
  });

  return rep.status(200).send("User added to team");
};
