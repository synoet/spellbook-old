import { FastifyInstance } from 'fastify';
import { $ref } from "./command.schema";

import {
  CommandResponseSchema,
  CommandsResponseSchema,
  CreateCommandSchema,
  GetCommandSchema,
  SearchCommandsSchema,
} from "./command.schema";

import {
  getHandler,
  getOneHandler,
  createHandler,
  searchHandler,
} from './command.controller';

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
    createHandler,
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
    getOneHandler,
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
    getHandler,
  )

  server.get<{
    Querystring: SearchCommandsSchema, 
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
    searchHandler,
  )
}
