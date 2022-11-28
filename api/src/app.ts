import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { attachCommandRoutes } from "./modules/command";
import { attachSnippetRoutes } from "./modules/snippet";
import { attachAuthRoutes } from "./modules/auth";
import { attachTeamRoutes } from "./modules/team";
import { attachLanguageRoutes } from "./modules/language";
import cors from "@fastify/cors";
const server = Fastify({ logger: true });

server.register(cookie);
server.register(cors, {});

server.get("/health", async (req, res) => {
  return { status: "OK" };
});

attachAuthRoutes(server);
attachCommandRoutes(server);
attachSnippetRoutes(server);
attachTeamRoutes(server);
attachLanguageRoutes(server);

async function main() {
  await server.listen({ port: 5000, host: "0.0.0.0" }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

main();
