import { FastifyInstance } from 'fastify';
import { $ref } from "./command.schema";
import {
  CommandResponseSchema,
  CommandsResponseSchema,
  CreateCommandSchema,
  GetCommandSchema,
  SearchCommandsSchema,
} from "./command.schema";

export default async function(server: FastifyInstance) {
  server.post<{
    Body: CreateCommandSchema, 
    Reply: CommandResponseSchema,
  }>
  ("/", 
    {
      schema: {
        body: $ref("createCommandSchema"),
        response: {
          201: $ref("commandResponseSchema")
        }
      }
    },
    async (request, reply) => {},
  )

  server.get<{
    Params: GetCommandSchema,
    Reply: CommandResponseSchema,
  }>
  ("/:id",
    {
      schema: {
        params: $ref("getCommandSchema"),
        response: {
          200: $ref("commandResponseSchema")
        },
      }
    },
    async (request, reply) => {},
  )

  server.get<{
    Reply: CommandsResponseSchema,
  }>
  ("/", 
    {
      schema: {
        response: {
          200: $ref("commandsResponseSchema"),

        }
      }
    },
    async (request, reply) => {},
  )

  server.get<{
    Params: SearchCommandsSchema, 
    Reply: CommandsResponseSchema,
  }>
  ("/search",
    {
      schema: {
        querystring: $ref("searchCommandsSchema"),
        response: {
          200: $ref("commandsResponseSchema"),
        }
      }
    },
    async (request, reply) => {},
  )
}
