# tRPC-Nuxt

End-to-end typesafe APIs with [tRPC.io](https://trpc.io/) in Nuxt applications.

> [!NOTE]
> You are looking at the branch that supports tRPC v11 which is a work in progress.

<p align="center">
  <figure>
    <img src="https://i.imgur.com/3AZlBZH.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
  </figure>
</p>

## Installation

```bash
npm install trpc-nuxt @trpc/server @trpc/client
```

Add `trpc-nuxt` to your `nuxt.config.ts`'s `build.transpile`:

```ts
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  }
})
```

## Setup

### 1. Create your [tRPC router](https://trpc.io/docs/server/routers):

```ts
// server/trpc/trpc.ts
import { initTRPC } from '@trpc/server'
import type { Context } from './context'

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    await anExpensiveOperation();
    return `Hello tRPC v11 @ ${new Date().toLocaleTimeString()}`;
  })
})

export type Router = typeof router
```

### 2. Create a [tRPC Context](https://trpc.io/docs/context):

```ts
// server/trpc/context.ts
export async function createContext(event: H3Event) {
  return {
    // context information
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>
```

### 3. Register the tRPC API handler:

```ts
// server/api/trpc/[trpc].ts
import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { router } from '~/server/trpc/trpc'
import { createContext } from '~/server/trpc/context'

export default createTRPCNuxtHandler({
  endpoint: '/api/trpc', // default endpoint is /api/trpc
  router,
  createContext,
})
```

### 4. Create a plugin to easily use the tRPC client in your pages:

```ts
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { Router } from '~/server/trpc/trpc'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<Router>({
    links: [
      httpBatchLink({
        url: '/api/trpc' // default endpoint is /api/trpc
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
```

### 5. Call the tRPC procedures in your pages:

```vue
<script setup lang="ts">
const { $client } = useNuxtApp()

const { data: greeting } = await $client.greeting.useQuery()
</script>

<template>
  <div>{{ greeting }}</div>
</template>
```

## License

MIT
