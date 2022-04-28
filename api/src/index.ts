import Fastify, { FastifyInstance } from 'fastify';
import configureSwagger from './config/swagger';
import attachCommandRoutes from './modules/command';

const app: FastifyInstance = Fastify({ logger: true });

configureSwagger(app);
attachCommandRoutes(app);

app.listen(8000, (err, address) => {
  if (err) app.log.error(err)
  app.log.info(`server listening on ${address}`);
});
