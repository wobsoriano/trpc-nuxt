import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { H3Event } from 'h3'
import type { inferAsyncReturnType } from '@trpc/server'

const baseURL = 'https://jsonplaceholder.typicode.com'

const TodoShape = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = z.infer<typeof TodoShape>

const t = initTRPC.context<Context>().create()

// We explicitly export the methods we use here
// This allows us to create reusable & protected base procedures
export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure

const anotherRouter = router({
  getTodo: publicProcedure
    .input(z.number())
    .query((req) => {
      return $fetch<Todo>(`${baseURL}/todos/${req.input}`)
    }),
  addTodo: publicProcedure
    .input(TodoShape)
    .mutation((req) => {
      return $fetch<Todo>(`${baseURL}/todos`, {
        method: 'POST',
        body: req.input,
      })
    }),
})

export const appRouter = router({
  todo: anotherRouter,
  getTodos: publicProcedure.query(() => {
    return $fetch<Todo[]>(`${baseURL}/todos`)
  }),
  getTodo: publicProcedure
    .input(z.number())
    .query((req) => {
      console.log('REQ', req)
      return $fetch<Todo>(`${baseURL}/todos/${req.input}`)
    }),
})

export type AppRouter = typeof appRouter

export async function createContext(event: H3Event) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  // const x = useCookies(event)
  console.log(event.req.headers)

  return {

  }
}

type Context = inferAsyncReturnType<typeof createContext>
