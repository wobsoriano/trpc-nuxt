---
title: Client
description: Set up with Nuxt.
---

The magic of tRPC is making strongly typed API calls without relying on code generation. With full-stack TypeScript projects, you can directly import types from the server into the client! This is a vital part of how tRPC works.

## Initialize a tRPC client

Create a typesafe client via a Nuxt [plugin](https://nuxt.com/docs/guide/directory-structure/plugins) with the `createTRPCNuxtClient` function from `trpc-nuxt/client`, and add a `links` array with a [terminating link](https://trpc.io/docs/links#the-terminating-link). If you want to learn more about tRPC links, check out the docs [here](https://trpc.io/docs/links):

```ts
import type { AppRouter } from '~/server/trpc/routers'
// plugins/trpc.ts
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
      }),
    ],
  })

  return {
    provide: {
      trpc,
    },
  }
})
```

As you can see, we passed `AppRouter` as a type argument of `createTRPCNuxtClient`. This returns a strongly typed client instance, a proxy that mirrors the structure of your `AppRouter` on the client:

```vue
<script setup lang="ts">
const { $trpc } = useNuxtApp()

// With composables

const getUser = await $trpc.getUser.useQuery('id_bilbo')
// => { data: { id: 'id_bilbo', name: 'Bilbo' }, pending: false, error: false };

const createUser = await $trpc.createUser.useMutation()
await createUser.mutate({ name: 'Frodo' })
// => { id: 'id_frodo', name: 'Frodo' };

// With vanilla

const bilbo = await $trpc.getUser.query('id_bilbo')
// => { id: 'id_bilbo', name: 'Bilbo' };

const frodo = await $trpc.createUser.mutate({ name: 'Frodo' })
// => { id: 'id_frodo', name: 'Frodo' };
</script>
```
