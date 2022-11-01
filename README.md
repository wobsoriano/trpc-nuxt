# tRPC-Nuxt

[![Version](https://img.shields.io/npm/v/trpc-nuxt?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/trpc-nuxt)

End-to-end typesafe APIs with [tRPC.io](https://trpc.io/) in Nuxt applications.

<p align="center">
  <figure>
    <img src="https://i.imgur.com/AjmNUxj.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
  </figure>
</p>

## Quick Start
get started with an online playground on [https://codesandbox.io/p/sandbox/lucid-buck-3x3n3x](codesandbox)

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
    baseURL: '', // Set empty string (default) to make requests by relative address 
    endpoint: '/trpc', // defaults to /trpc
  },
  typescript: {
    strict: true // required to make input/output types work
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

const newUser = await client.mutation('createUser', {
  name: 'wagmi'
})
```

## useAsyncQuery

A thin wrapper around [`useAsyncData`](https://v3.nuxtjs.org/api/composables/use-async-data/) and `client.query()`.

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
  lazy: false
})
```

## useClientHeaders

A composable that lets you add additional properties to pass to the tRPC Client. It uses `useState` from [nuxt 3](https://v3.nuxtjs.org/api/composables/use-state).

```ts
const headers = useClientHeaders()

const { data: token } = await useAsyncQuery(['auth.login', { username, password }])

headers.value.Authorization = `Bearer ${token}`

// All client calls will now include the Authorization header.
```

## Options

trpc-nuxt accepts the following options exposed under `~/server/trpc/index.ts`:

```ts
import * as trpc from '@trpc/server'
import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import type { OnErrorPayload } from 'trpc-nuxt/api'

export const router = trpc.router<inferAsyncReturnType<typeof createContext>>()

// Optional
// https://trpc.io/docs/context
export const createContext = (event: H3Event) => {
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
- [Merging Routers](/recipes/merging-routers.md)
- [Error Handling](/recipes/error-handling.md)
- [Error Formatting](/recipes/error-formatting.md)
- [Inference Helpers](/recipes/inference-helpers.md)

Learn more about tRPC.io [here](https://trpc.io/docs/v9).

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## License

MIT
