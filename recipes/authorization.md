## Authorization

The `createContext`-function is called for each incoming request so here you can add contextual information about the calling user from the request object. Learn more about authorization [here](https://trpc.io/docs/authorization).

```ts
// ~/server/trpc/index.ts
import * as trpc from '@trpc/server'
import type { CompatibilityEvent } from 'h3'
import { decodeAndVerifyJwtToken } from '~/somewhere/in/your/app/utils'

// The app's context - is generated for each incoming request
export async function createContext({ req }: CompatibilityEvent) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await decodeAndVerifyJwtToken(req.headers.authorization.split(' ')[1])
      return user
    }
    return null
  }
  const user = await getUserFromHeader()

  return {
    user,
  }
}

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  // open for anyone
  .query('hello', {
    input: z.string().nullish(),
    resolve: ({ input, ctx }) => {
      return `hello ${input ?? ctx.user?.name ?? 'world'}`
    },
  })
  // checked in resolver
  .query('secret', {
    resolve: ({ ctx }) => {
      if (!ctx.user)
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' })

      return {
        secret: 'sauce',
      }
    },
  })
```
