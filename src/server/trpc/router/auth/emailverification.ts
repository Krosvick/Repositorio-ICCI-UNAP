import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { mailer } from "./mailer";
import bcrypt from "bcrypt";

export const verifyEmailRouter = router({
    sendEmail: protectedProcedure.input(z.object({
        //email from @estudiantesunap.cl regex
        email: z.string().regex(/^[a-zA-Z0-9._-]+@estudiantesunap.cl$/),
    })).mutation(async ({input,ctx}) => {
        const id = ctx.session.user.id;
        const registered = await ctx.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                institutionalEmail: input.email,
            }
        });
        console.log(registered);
        let info;
        await bcrypt.hash(registered.id, 10).then(async function(hash){
            await ctx.prisma.user.update({
                where: {
                    institutionalEmail: input.email,
                },
                data: {
                    hashedId: hash,
                }
            })
            info = await mailer(input.email,hash,"verificar/","Verificar correo");
        })
        return info;
    }),
    verify: publicProcedure.input(z.object({
        hashedId: z.string(),
    })).mutation(async ({input,ctx}) => {
        const user = await ctx.prisma.user.findFirst({
            where: {
                hashedId: input.hashedId,
            }
        });
        if (!user) {
            throw new Error("Token invalido");
        }
        if(user.institutionalEmail){
            return await ctx.prisma.user.update({
                where: {
                    institutionalEmail: user.institutionalEmail,
                },
                data: {
                    IEVerified: true,
                }
            })
        }
        return {message: "Error al verificar correo"};
    }),
});