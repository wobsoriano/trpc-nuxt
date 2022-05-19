import * as trpc from '@trpc/server'
import { z } from 'zod'

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const baseURL = 'https://jsonplaceholder.typicode.com'

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
