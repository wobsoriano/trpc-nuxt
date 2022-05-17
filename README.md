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

Create your tRPC [routes](https://trpc.io/docs/router) and [context](https://trpc.io/docs/context) under `server/fn/index.ts`:

```ts
// ~/server/fn/index.ts
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  // queries and mutations...
  .query('hello', {
    resolve: () => 'world',
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
const data = await client.query('hello')
console.log(data) // => 👈 world
</script>
```

## Composables

Composables are auto-imported.

###`useTrpcQuery(path, input)`

