import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";

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
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const response = await axios
    .post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    )
    .catch((e: Error) => {
      console.error(e);
      return rep.status(500).send("Error Getting Access Token");
    });

  return rep.status(200).send("OK");
};
