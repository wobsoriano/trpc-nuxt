import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter ({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' &&
          error.cause instanceof ZodError
            ? error.cause!.flatten()
            : null
      }
    }
  }
})

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router

/**
  * Create an unprotected procedure
  * @see https://trpc.io/docs/v10/procedures
  **/
export const publicProcedure = t.procedure

/**
  * @see https://trpc.io/docs/v10/middlewares
  */
export const middleware = t.middleware

/**
  * @see https://trpc.io/docs/v10/merging-routers
  */
export const mergeRouters = t.mergeRouters
