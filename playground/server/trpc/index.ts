import * as trpc from '@trpc/server'
import { z } from 'zod'

const baseURL = 'https://jsonplaceholder.typicode.com'

const TodoShape = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = z.infer<typeof TodoShape>

export const router = trpc.router()
  .query('getTodos', {
    async resolve() {
      return await $fetch<Todo[]>(`${baseURL}/todos`)
    },
  })
  .query('getTodo', {
    input: z.number(),
    async resolve(req) {
      return await $fetch<Todo>(`${baseURL}/todos/${req.input}`)
    },
  })
  .mutation('addTodo', {
    input: TodoShape,
    async resolve(req) {
      return await $fetch<Todo>(`${baseURL}/todos`, {
        method: 'POST',
        body: req.input,
      })
    },
  })
