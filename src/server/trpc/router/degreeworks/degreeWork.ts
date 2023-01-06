import {date, z} from "zod";
import { degreeformSchema } from "../../../../pages/degreeform";
import { router,publicProcedure, protectedProcedure } from "../../trpc";
import {AWS} from "../../../../libs/aws";
import { degreeFormAdminSchema } from "../../../../pages/edit/[id]";

const s3 = new AWS.S3();

export const degreeWorkRouter = router({
    publish: protectedProcedure.input(degreeformSchema)
    .mutation(async ({input,ctx}) => {
        const file:any = input.file;
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
    getDegreeWorks: protectedProcedure.input(z.object({
        //prisma offset pagination
        skip: z.number(),
        take: z.number(), 
    })).query
    (async ({input,ctx}) => {
        const {skip, take} = input;
        const degreeWorks = await ctx.prisma.degreeWorks.findMany({
            skip,
            take,
        });
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
            Bucket: process.env.AWS_S3_BUCKET_VERCEL, 
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
      take: z.number().optional(),
      isAdmin: z.boolean().optional().default(false),
    })).query(async ({input,ctx}) => {
      const {skip, take,isAdmin} = input;
      if(isAdmin){
        const works = await ctx.prisma.degreeWorks.findMany({
          skip,
          take,
          where: {
            //deleteat is null
            deletedAt: null
          }
        });
        return works;
      }else {
        const works = await ctx.prisma.degreeWorks.findMany({
          skip,
          take,
          where: {
            admisionDate: {
              not: null
          },
          deletedAt: null
          }
        });
        return works;
      }
    }),
    getOne:publicProcedure.input(z.object({
      id: z.string()
    })).query(async ({input,ctx}) => {
      const {id} = input;
      const work = await ctx.prisma.degreeWorks.findUnique({
        where: {
          id,
        }
      });
      return work;
    }
    ),
    update: protectedProcedure.input(z.object({
      id: z.string(),
      data: degreeFormAdminSchema
    })).mutation(async ({input,ctx}) => {
      const {id, data} = input;
      const {title, description, type, authors, advisors, year, admissionDate, file, deletedAt} = data;
      const work = await ctx.prisma.degreeWorks.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          type,
          authors,
          advisors,
          year,
          admisionDate: admissionDate,
          file,
          deletedAt,
        }
      });
      return work;
    }),
    deleteOne: protectedProcedure.input(z.object({
      id: z.string()
    })).mutation(async ({input,ctx}) => {
      const {id} = input;
      const work = await ctx.prisma.degreeWorks.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date()
        }
      });
      return work;
    }),
    count: publicProcedure
    .query(async ({ctx}) => {
      const count = await ctx.prisma.degreeWorks.count({
        where: {
          deletedAt: null
        }
      });
      return count;
    }),
});