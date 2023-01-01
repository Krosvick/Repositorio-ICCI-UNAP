import { router } from "../trpc";
import { authRouter } from "./auth";
import { degreeWorkRouter } from "./degreeworks/degreeWork";

export const appRouter = router({
  degreeWork: degreeWorkRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
