import { FastifyReply, FastifyRequest } from "fastify";
import {
  handleGithubCallback,
  getGithubProfile,
  createAuthToken,
  getAuthToken,
} from "./auth.service";
import { createUser, getUserByGithubId, getUser } from "../user/user.service";
import jwt from "jsonwebtoken";

export const authHandler = async (
  req: FastifyRequest<{ Querystring: { src: string } }>,
  rep: FastifyReply
) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const { src } = req.query;
  rep.setCookie("spellbook_auth_source", src);
  rep.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`
  );
};

export const callbackHandler = async (
  req: FastifyRequest<{ Querystring: { code: string } }>,
  rep: FastifyReply
) => {
  const { code }: { code: string } = req.query;

  const src = req.cookies.spellbook_auth_source;

  const access_token = await handleGithubCallback(code).catch((err) => {
    console.log(err);
    return rep.status(500).send("Failed to retrieve access token");
  });

  const profile = await getGithubProfile(access_token).catch((err) => {
    console.log(err);
    return rep.status(500).send("Failed to retrieve github profile");
  });

  const { login: username, avatar_url: profileImage, id: githubId } = profile;

  let user = await getUserByGithubId(`${githubId}`);

  if (!user) {
    user = await createUser({
      username,
      githubId: `${githubId}`,
      profileImage,
    }).catch((err) => {
      console.log(err);
      return rep.status(500).send("Failed to create user");
    });
  }

  const token = createAuthToken(user.id);

  rep.setCookie("spellbook_auth_token", token, {
    httpOnly: true,
  });

  if (src === "web") {
    if (process.env.NODE_ENV !== "production") {
      // if the source is the web then we can redirect to the redirect page.
      rep.redirect("http://localhost:3000/");
      return rep;
    }
  }

  return rep.status(200).send({
    status: "success",
    user: user,
  });
};

export const whoamiHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  const token = getAuthToken(req);
  console.log(token);

  if (!token) {
    return rep.status(401).send("Unauthorized");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!payload) {
    return rep.status(401).send("Unauthorized");
  }

  const { id, exp } = payload as any;

  if (Date.now() >= exp * 1000) {
    rep.status(401).send({
      status: "expired",
      message: "token expired",
    });
  }

  const user = await getUser(id).catch((err) => {
    console.log(err);
    return rep.status(500).send("Failed to retrieve user");
  });

  rep.status(200).send({
    user: user,
  });
};
