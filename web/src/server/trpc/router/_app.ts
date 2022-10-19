import { router } from "../trpc";
import { authRouter } from "./auth";
import { commandRouter } from "./command";
import { recipeRouter } from "./recipe";

export const appRouter = router({
  auth: authRouter,
  command: commandRouter,
  recipe: recipeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
