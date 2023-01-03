import { verifyEmailRouter } from "./auth/emailverification";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { degreeWorkRouter } from "./degreeworks/degreeWork";
import { userRouter } from "./user/user";

export const appRouter = router({
  degreeWork: degreeWorkRouter,
  auth: authRouter,
  verification: verifyEmailRouter,
  userRouter: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
