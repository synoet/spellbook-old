import { router } from "../trpc";
import { authRouter } from "./auth";
import {commandRouter} from './command'

export const appRouter = router({
  auth: authRouter,
  command: commandRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
