import { router,publicProcedure, protectedProcedure } from "../../trpc";
import {z} from "zod";

export const userRouter = router({
    checkEmail: publicProcedure.input(z.object({
        //email from @estudiantesunap.cl regex
        email: z.string().regex(/^[a-zA-Z0-9._-]+@estudiantesunap.cl$/),
    })).mutation(async ({input,ctx}) => {
        const check = await ctx.prisma.user.findFirst({
            where: {
                institutionalEmail: input.email,
                IEVerified: true,
            }
        });
        if(check){
            return true;
        }
        return false;
    }),
    addIEmail: protectedProcedure.input(z.object({
        //email from @estudiantesunap.cl regex
        id : z.string(),
        email: z.string().regex(/^[a-zA-Z0-9._-]+@estudiantesunap.cl$/),
    })).mutation(async ({input,ctx}) => {
        const check = await ctx.prisma.user.findUnique({
            where: {
                institutionalEmail: input.email,
            }
        });
        if(check){
            throw new Error("Email ya registrado");
        }
        return await ctx.prisma.user.update({
            where: {
                id: input.id,
            },
            data: {
                institutionalEmail: input.email,
            }
        })
    }
    ),
});