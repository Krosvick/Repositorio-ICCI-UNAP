import {z} from "zod";
import { degreeformSchema } from "../../../pages/degreeform";
import { router,publicProcedure, protectedProcedure } from "../trpc";
import { S3 } from "aws-sdk";

export const degreeWorkRouter = router({
    publish: protectedProcedure.input(degreeformSchema).mutation(async ({input,ctx}) => {
        const {title, description, type, authors, advisors, year, file} = input;
        S3.PresignedPost = {
            url: "https://s3.us-east-2.amazonaws.com/degree-works",
            fields: {
                key: "test",
                "Content-Type": "application/pdf",
                acl: "public-read",
            },
            expires: 60,
        };
        const degreeWork = await ctx.prisma.degreeWorks.create({
            data: {
                title,
                description,
                type,
                authors,
                advisors,
                year,
                file,
            }
        });
        return degreeWork;
    }),
    getDegreeWorks: publicProcedure.query(async ({ctx}) => {
        const degreeWorks = await ctx.prisma.degreeWorks.findMany();
        return degreeWorks;
    }),
});