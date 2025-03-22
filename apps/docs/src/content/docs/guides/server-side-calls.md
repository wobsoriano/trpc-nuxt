---
title: Server Side Calls
description: Set up with Nuxt.
---

You may need to call your procedure(s) directly from the server, `createCaller()` function returns you an instance of `RouterCaller` able to execute queries and mutations.

## Input query example

```ts
// server/trpc/init.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const router = t.router({
  // Create procedure at path 'greeting'
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}`),
})
```

```ts
// server/api/greeting.ts
import { appRouter } from '~/server/trpc/routers'

export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  const caller = appRouter.createCaller({})

  const greeting = await caller.greeting({ name })

  return {
    greeting
  }
})
```

## Mutation example

```ts
// server/trpc/init.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const posts = ['One', 'Two', 'Three']

const t = initTRPC.create()

export const router = t.router({
  post: t.router({
    add: t.procedure.input(z.string()).mutation(({ input }) => {
      posts.push(input)
      return posts
    }),
  }),
})
```

```ts
// server/api/post.ts
import { appRouter } from '@/server/trpc/routers'

export default defineEventHandler(async (event) => {
  const body = await getBody(event)
  const caller = appRouter.createCaller({})

  const post = await caller.post.add(body.post)

  return {
    post
  }
})
```
