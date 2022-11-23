import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSnippetSchema, GetAllSnippetsSchema, GetSnippetSchema} from "./snippet.schema";
import { getAllSnippets, getSnippet, createSnippet } from "./snippet.service";

export const createSnippetHandler = async (
  req: FastifyRequest<{ Body: CreateSnippetSchema }>,
  rep: FastifyReply
) => {
  const snippet = await createSnippet(req.body).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Creating Snippet");
  });
  rep.status(201).send(snippet);
};

export const getAllSnippetsHandler = async (
  req: FastifyRequest<{ Querystring: GetAllSnippetsSchema }>,
  rep: FastifyReply
) => {
  const response = await getAllSnippets(req.query).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Getting Commands");
  });
  rep.status(200).send({
    snippets: response,
    facets: req.query,
  });
};

export const getSnippetHandler = async (
  req: FastifyRequest<{ Params: GetSnippetSchema }>,
  rep: FastifyReply
) => {
  const snippet = await getSnippet(req.params.id).catch((e) => {
    console.error(e);
    rep.status(500).send("Error Getting Command");
  });

  rep.status(200).send(snippet);
};
