# tRPC-Nuxt

[![Version](https://img.shields.io/npm/v/trpc-nuxt?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/trpc-nuxt)

End-to-end typesafe APIs with [tRPC.io](https://trpc.io/) in Nuxt applications.

## Install

```bash
npm i trpc-nuxt
```

```ts
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['trpc-nuxt'],
})
```

## Usage

Expose your tRPC [routes](https://trpc.io/docs/router) and [context](https://trpc.io/docs/context) under `~/server/trpc/index.ts`:

```ts
// ~/server/trpc/index.ts
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  // queries and mutations...
  .query('hello', {
    resolve: () => 'world',
  })
  .query('bye', {
    resolve() {
      return {
        text: 'goodbye',
      }
    },
  })

// optional
export const createContext = (event: CompatibilityEvent) => {
  // ...
  return {
    /** context data */
  }
}

// optional
export const responseMeta = () => {
  // ...
  return {
    // { headers: ... }
  }
}
```

Use the client like so:

```html
<script setup lang="ts">
const client = useClient()

const greeting = await client.query('hello');
console.log(greeting); // => 👈 world

const farewell = await client.query('bye');
console.log(farewell); // => 👈 goodbye
</script>
```

## Recipes

### Validation

tRPC works out-of-the-box with yup/superstruct/zod/myzod/custom validators. Learn more about input validation [here](https://trpc.io/docs/router#input-validation).

```ts
// ~/server/trpc/index.ts
import { z } from 'zod'

export const router = trpc
  .router()
  .mutation('createUser', {
    // validate input with Zod
    input: z.object({
      name: z.string().min(5)
    }),
    async resolve(req) {
      // use your ORM of choice
      return await UserModel.create({
        data: req.input,
      })
    },
  })
```

### Authorization

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

Learn more about tRPC.io [here](https://trpc.io/docs).

## License

MIT
