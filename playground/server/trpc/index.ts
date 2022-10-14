import type { inferAsyncReturnType } from '@trpc/server'
import type { CompatibilityEvent } from 'h3'

import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

const baseURL = 'https://jsonplaceholder.typicode.com'

const TodoShape = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = z.infer<typeof TodoShape>

export const transformer = superjson

export const router = trpc.router<Context>()
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
  .query('getCurrentDate', {
    async resolve() {
      return new Date()
    },
  })
  .mutation('addTodo', {
    input: TodoShape,
    async resolve(req) {
      console.log(req.input)
      return await $fetch<Todo>(`${baseURL}/todos`, {
        method: 'POST',
        body: req.input,
      })
    },
  })

export async function createContext(event: CompatibilityEvent) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  // const x = useCookies(event)
  console.log(event.req.headers)

  return {

  }
}

type Context = inferAsyncReturnType<typeof createContext>
