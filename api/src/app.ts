import Fastify from 'fastify';

import userRoutes from './modules/command/command.route';

const server = Fastify();

server.get('/health', async (req, res) => {
  return {status: 'OK'}
});


async function main(){
  server.register(userRoutes, {prefix: '/api/users'})
  await server.listen({port: 5000}).catch((e) => {
    console.error(e);
    process.exit(1);
  })
}

main();