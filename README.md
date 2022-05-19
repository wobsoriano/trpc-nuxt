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
```

Use the client like so:

```ts
const client = useClient() // auto-imported

const greeting = await client.query('hello')
console.log(greeting) // => 👈 world

const farewell = await client.query('bye')
console.log(farewell) // => 👈 goodbye
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

## Recipes

- [Validation](/recipes/validation.md)
- [Authorization](/recipes/authorization.md)
- [Error Handling](/recipes/error-handling.md)
- [Error Formatting](/recipes/error-formatting.md)

Learn more about tRPC.io [here](https://trpc.io/docs).

## License

MIT
