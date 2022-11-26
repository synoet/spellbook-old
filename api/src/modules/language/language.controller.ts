import { FastifyRequest, FastifyReply } from "fastify";
import { detectLanguage } from "./language.service";

export const detectHandler = async (
  req: FastifyRequest<{ Querystring: { text: string } }>,
  rep: FastifyReply
) => {
  const { text } = req.query;
  const response = await detectLanguage(text).catch((err) => {
    console.log(err);
    rep.status(500).send("Failed to detect language");
  });

  return rep.status(200).send(response);
};
