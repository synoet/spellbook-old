import { FastifyReply, FastifyRequest } from "fastify";
import {
  handleGithubCallback,
  getGithubProfile,
  createAuthToken,
} from "./auth.service";
import { createUser, getUserByGithubId } from "../user/user.service";

export const authHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  rep.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`
  );
};

export const callbackHandler = async (
  req: FastifyRequest<{ Querystring: { code: string } }>,
  rep: FastifyReply
) => {
  const { code }: { code: string } = req.query;

  const access_token = await handleGithubCallback(code).catch((err) => {
    console.error(err);
    return rep.status(500).send("Failed to retrieve access token");
  });

  const profile = await getGithubProfile(access_token).catch((err) => {
    console.log(err);
    return rep.status(500).send("Failed to retrieve github profile");
  });

  const { login: username, avatar_url: profileImage, id: githubId } = profile;

  let user = await getUserByGithubId(githubId);

  if (!user) {
    user = await createUser({ username, githubId, profileImage }).catch(
      (err) => {
        console.error(err);
        return rep.status(500).send("Failed to create user");
      }
    );
  }

  const token = createAuthToken({ id: user.id });

  return rep.status(200).send({
    status: "success",
    token: token,
  });
};
