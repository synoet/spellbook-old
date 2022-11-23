import Fastify from "fastify";
import { attachCommandRoutes } from "./modules/command";
import { attachSnippetRoutes } from "./modules/snippet";
import { attachAuthRoutes } from "./modules/auth";
const server = Fastify();

server.get("/health", async (req, res) => {
  return { status: "OK" };
});

attachAuthRoutes(server);
attachCommandRoutes(server);
attachSnippetRoutes(server);

async function main() {
  await server.listen({ port: 5000, host: "0.0.0.0"}).catch((e) => {

    console.error(e);
    process.exit(1);
  });
}

main();
