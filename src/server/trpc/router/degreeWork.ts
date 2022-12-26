import { DegreeWorkType } from "@prisma/client";
import {z} from "zod";
import { router,publicProcedure, protectedProcedure } from "../trpc";

export const degreeWorkRouter = router({
    publish: protectedProcedure.input(z.object({
        title: z.string(),
        description: z.string(),
        //type is an enum in prisma
        type: z.enum([DegreeWorkType.THESIS, DegreeWorkType.ARTICLE]),
        confirmed: z.boolean(),
        authors: z.array(z.string()),
        advisors: z.array(z.string()),
        year: z.number(),
        semester: z.string(),
        file: z.any(),
    })).mutation(async ({input,ctx}) => {
        const {title, description, type, confirmed, authors, advisors, year, semester, file} = input;
        const degreeWork = await ctx.prisma.degreeWork.create({
            data: {
                title,
                description,
                type,
                confirmed,
                //authors is going to be an array of strings, so we need to convert it into an string separated by commas
                authors: authors.join(","),
                advisors: advisors.join(","),
                year,
                semester,
                file,
            }
        });
        return degreeWork;
    }),
    getDegreeWorks: publicProcedure.query(async ({ctx}) => {
        const degreeWorks = await ctx.prisma.degreeWork.findMany();
        return degreeWorks;
    }),
});