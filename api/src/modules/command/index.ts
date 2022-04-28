import { FastifyInstance } from 'fastify';
import commandRoutes from './command.routes';
import { commandSchemas } from './command.schema';

export default function attachCommandRoutes(app: FastifyInstance){
  for (const schema of commandSchemas) {
    app.addSchema(schema);
  }

  app.register(commandRoutes, { prefix: '/api/commands' });
}
