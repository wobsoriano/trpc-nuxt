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

Create your tRPC [routes](https://trpc.io/docs/router) and [context](https://trpc.io/docs/context) under `~/trpc/index.ts`:

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

### `useClient()`

A typesafe client with the `createTRPCClient` method from `@trpc/client`.

```html
<script setup lang="ts">
const client = useClient()

const bilbo = await client.query('getUser', 'id_bilbo');
// => { id: 'id_bilbo', name: 'Bilbo' };

const frodo = await client.mutation('createUser', { name: 'Frodo' });
// => { id: 'id_frodo', name: 'Frodo' };
</script>
```

### `useClientQuery`

`client.query` wrapped in [`useAsyncData`](https://v3.nuxtjs.org/guide/features/data-fetching/#useasyncdata).

```html
<script setup lang="ts">
const { data, pending, refresh, error } = await useClientQuery('getUser', 'id_bilbo');

console.log(data.value) // => { id: 'id_frodo', name: 'Frodo' };
</script>
```

### `useLazyClientQuery`

`client.query` wrapped in [`useLazyAsyncData`](https://v3.nuxtjs.org/guide/features/data-fetching/#uselazyasyncdata).

```html
<script setup lang="ts">
const { data, pending, refresh, error } = await useLazyClientQuery('getUser', 'id_bilbo');

console.log(data.value) // => { id: 'id_frodo', name: 'Frodo' };
</script>
```

