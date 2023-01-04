import {z} from "zod";
import { degreeformSchema } from "../../../../pages/degreeform";
import { router,publicProcedure, protectedProcedure } from "../../trpc";
import {AWS} from "../../../../libs/aws";

const s3 = new AWS.S3();

export const degreeWorkRouter = router({
    publish: protectedProcedure.input(degreeformSchema)
    .mutation(async ({input,ctx}) => {
        let file:any = input.file;
        const {title, description, type, authors, advisors, year} = input;
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
    getSignedUrl: protectedProcedure.input(z.object({
        fileName: z.string(),
    })).mutation(async ({input,ctx}) => {
        
        return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: input.fileName,
            },
            Conditions: [
              ['starts-with', '$Content-Type', ''],
              ['content-length-range', 0, 100000000],
            ],
            Expires: 30,
            Bucket: process.env.AWS_S3_BUCKET_NAME, 
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          }
        );
        })
    }),
    listWorks: publicProcedure.input(z.object({
      //prisma offset pagination
      skip: z.number().optional(),
      take: z.number().optional()
    })).query(async ({input,ctx}) => {
      const {skip, take} = input;
      const works = await ctx.prisma.degreeWorks.findMany({
        skip,
        take,
      }
      );
      return works;
    }),

});