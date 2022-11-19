import { FastifyInstance } from 'fastify';
import {
  $ref,
  CreateCommandSchema,
} from './command.schema'


const userRoutes = async (server: FastifyInstance) => {
  server.post<{
    Body: CreateCommandSchema,
  }
  >('/', {
    schema: {
      body: $ref.createCommandSchema,

    }
  })

}

export default userRoutes;