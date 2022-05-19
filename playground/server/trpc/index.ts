// ~/server/trpc/index.ts
import { ZodError, z } from 'zod'
import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CompatibilityEvent } from 'h3'
import type { ResponseMetaFnPayload } from 'trpc-nuxt/api'
// import superjson from 'superjson'

const fakeUsers = [
  { id: 1, username: 'jcena' },
  { id: 2, username: 'dbatista' },
  { id: 3, username: 'jbiden' },
]

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST'
          && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  })
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

export const createContext = (event: CompatibilityEvent) => {
  event.res.setHeader('x-ssr', 1)
  return {}
}

export const responseMeta = (opts: ResponseMetaFnPayload<any>) => {
  // const nuxtApp = useNuxtApp()
  // const client = useClient()
  // console.log(opts)

  // if (nuxtApp.nuxtState) {
  //   nuxtApp.nuxtState.trpc = client.runtime.transformer.serialize({
  //     ctx: opts.ctx,
  //     errors: opts.errors,
  //   })
  // }
  // else {
  //   nuxtApp.nuxtState = {
  //     trpc: client.runtime.transformer.serialize({
  //       ctx: opts.ctx,
  //       errors: opts.errors,
  //     }),
  //   }
  // }

  return {}
}
