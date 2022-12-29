import { router,publicProcedure, protectedProcedure } from "../trpc";
import {z} from "zod";

export const userRouter = router({
    emailRegister: protectedProcedure.input(