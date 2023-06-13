import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      console.log(input)
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    }),
  products: publicProcedure.query(async () => {
    return {
      title: 'TRPC Nuxt',
      price: 12.0,
      description: 'Check out the trpc-nuxt repo',
    }
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter
