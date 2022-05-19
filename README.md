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
  trpc: {
    baseURL: 'http://localhost:3000', // defaults to http://localhost:3000
    trpcURL: '/api/trpc', // defaults to /api/trpc
  },
  typescript: {
    strict: true // set this to true to make input/output types work
  }
})
```

## Usage

Expose your tRPC [routes](https://trpc.io/docs/router) under `~/server/trpc/index.ts`:

```ts
// ~/server/trpc/index.ts
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'
import { z } from 'zod' //  yup/superstruct/zod/myzod/custom

export const router = trpc.router()
  // queries and mutations...
  .query('getUsers', {
    async resolve(req) {
      // use your ORM of choice
      return await UserModel.all()
    },
  })
  .mutation('createUser', {
    // validate input with Zod
    input: z.object({ name: z.string().min(5) }),
    async resolve(req) {
      // use your ORM of choice
      return await UserModel.create({
        data: req.input,
      })
    },
  })
```

Use the client like so:

```ts
const client = useClient() // auto-imported

const users = await client.query('getUsers')

const addUser = async () => {
  const mutate = await client.mutation('createUser', {
    name: 'wagmi'
  })
}
```

## useAsyncQuery

A thin wrapper around [`useAsyncData`](https://v3.nuxtjs.org/api/composables/use-async-data/).

The first argument is a `[path, input]`-tuple - if the `input` is optional, you can omit the, `input`-part.

You'll notice that you get autocompletion on the `path` and automatic typesafety on the `input`.

```ts
const {
  data,
  pending,
  error,
  refresh
} = await useAsyncQuery(['getUser', { id: 69 }], {
  // pass useAsyncData options here
  server: true
})
```

## Options

trpc-nuxt accepts the following options exposed under `~/server/trpc.index.ts`:

```ts
import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CompatibilityEvent } from 'h3'
import type { OnErrorPayload } from 'trpc-nuxt/api'

export const router = trpc.router<inferAsyncReturnType<typeof createContext>>()

// Optional
// https://trpc.io/docs/context
export const createContext = (event: CompatibilityEvent) => {
  // ...
  return {
    /** context data */
  }
}

// Optional
// https://trpc.io/docs/caching#using-responsemeta--to-cache-responses
export const responseMeta = () => {
  // ...
  return {
    // { headers: ... }
  }
}

// Optional
// https://trpc.io/docs/error-handling#handling-errors
export const onError = (payload: OnErrorPayload<typeof router>) => {
  // Do whatever here like send to bug reporting and stuff
}
```

## Recipes

- [Validation](/recipes/validation.md)
- [Authorization](/recipes/authorization.md)
- [Error Handling](/recipes/error-handling.md)
- [Error Formatting](/recipes/error-formatting.md)

Learn more about tRPC.io [here](https://trpc.io/docs).

## License

MIT
