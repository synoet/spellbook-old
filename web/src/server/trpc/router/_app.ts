import { router } from "../trpc";
import { authRouter } from "./auth.router";
import { commandRouter } from "./command.router";
import { snippetRouter } from "./snippet.router";
import { linkRouter } from "./link.router";

export const appRouter = router({
  auth: authRouter,
  command: commandRouter,
  snippet: snippetRouter,
  link: linkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
