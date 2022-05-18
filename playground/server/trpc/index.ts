// ~/server/trpc/index.ts
import { z } from 'zod'
import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'

const fakeUsers = [
  { id: 1, username: 'jcena' },
  { id: 2, username: 'dbatista' },
  { id: 3, username: 'jbiden' },
]

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  .query('getUsers', {
    resolve() {
      return fakeUsers
    },
  })
  .query('getUser', {
    // validate input with Zod
    input: z.object({
      username: z.string().min(5),
    }),
    resolve(req) {
      return fakeUsers.find(i => i.username === req.input.username) ?? null
    },
  })
  .mutation('createUser', {
    input: z.object({ username: z.string().min(5) }),
    resolve(req) {
      const newUser = {
        id: fakeUsers.length + 1,
        username: req.input.username,
      }
      fakeUsers.push(newUser)
      return newUser
    },
  })

export const createContext = () => {
  // ...
  return {
    /** context data */
  }
}
