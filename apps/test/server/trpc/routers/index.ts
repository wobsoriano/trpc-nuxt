import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '../init'

let count = 0

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}`,
      };
    }),
  getCount: baseProcedure
    .query(() => {
      return count;
    }),
  setCount: baseProcedure
    .input(z.number())
    .mutation(async (opts) => {
      count = opts.input;
      return count;
    }),
  getUserId: baseProcedure
    .query(({ ctx }) => {
      return ctx.userId;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
