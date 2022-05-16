import * as trpc from '@trpc/server'
import { z } from 'zod'

export const router = trpc
  .router()
  .query('getUser', {
    input: z.object({ name: z.string().min(5) }),
    async resolve(req) {
      return { id: 1, name: req.input.name }
    },
  })
  .query('hello', {
    resolve: () => 'world',
  })

export type Router = typeof router
