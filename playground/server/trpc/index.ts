// ~/server/trpc/index.ts
import { z } from 'zod'
import * as trpc from '@trpc/server'

const fakeUsers = [
  { id: 1, username: 'jcena', name: 'John Cena' },
  { id: 2, username: 'dbatista', name: 'Dave Batista' },
  { id: 3, username: 'jbiden', name: 'Joe Biden' },
]

export const router = trpc
  .router()
  .query('getUser', {
    // validate input with Zod
    input: z.object({
      username: z.string().min(5),
    }),
    resolve(req) {
      return fakeUsers.find(i => i.username === req.input.username)
    },
  })
