import * as trpc from '@trpc/server'
import { z } from 'zod'
import type { CompatibilityEvent } from 'h3'

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

// optional
export const createContext = (event: CompatibilityEvent) => {
  return {
    user: {
      id: 69,
      name: 'robert',
    },
  }
}

// optional
export const responseMeta = () => {
  // ...
  return {
    // { headers: ... }
  }
}

export type Router = typeof router
