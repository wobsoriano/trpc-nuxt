# tRPC-Nuxt

[![Version](https://img.shields.io/npm/v/trpc-nuxt?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/trpc-nuxt)

End-to-end typesafe APIs with [tRPC.io](https://trpc.io/) in Nuxt applications.

## Install

```bash
npm i trpc-nuxt -D
```

```ts
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['trpc-nuxt'],
})
```

## Usage

Create your tRPC [routes](https://trpc.io/docs/router) and [context](https://trpc.io/docs/context) under `~/server/trpc/index.ts`:

```ts
// ~/trpc/index.ts
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
export const createContext = () => {
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

### Input validation with [Zod](https://github.com/colinhacks/zod)

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

Learn more about tRPC.io [here](https://trpc.io/docs).

## License

MIT
