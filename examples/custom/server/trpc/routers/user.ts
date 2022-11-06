import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

const baseURL = 'https://jsonplaceholder.typicode.com'

const UserShape = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string()
})

export type User = z.infer<typeof UserShape>

export const userRouter = router({
  getUsers: publicProcedure
    .query(() => {
      return $fetch<User[]>(`${baseURL}/users`)
    }),
  getUser: publicProcedure
    .input(z.number())
    .query((req) => {
      return $fetch<User>(`${baseURL}/users/${req.input}`)
    }),
  addUser: publicProcedure
    .input(UserShape)
    .mutation((req) => {
      return $fetch<User>(`${baseURL}/users`, {
        method: 'POST',
        body: req.input
      })
    })
})
