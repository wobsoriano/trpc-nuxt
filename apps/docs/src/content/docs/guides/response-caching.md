---
title: Response Caching
description: Set up with Nuxt.
---

Your server responses must [satisfy some criteria](https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching) in order for them to be cached (i.e. by Vercel's Edge Network). Please refer to [this section of the tRPC.io documentation](https://trpc.io/docs/caching) for more information.

The `createTRPCNuxtHandler` function conveniently allows you to specify a `responseMeta` function.

```ts
// server/api/trpc/[trpc].ts
import { createTRPCNuxtHandler } from 'trpc-nuxt/server';
import { appRouter } from '~/server/trpc/routers';

export default createTRPCNuxtHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  responseMeta(opts) {
    // cache request for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    return {
      headers: {
        'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    };
  },
});
```

You can also take advantage of Nitro's [Cache API](https://nitro.unjs.io/guide/cache#cache-api) if doing server-side calls:

```ts
import { appRouter } from '~/server/trpc/routers';

const caller = appRouter.createCaller({});

export default defineCachedEventHandler(async (event) => {
  const { name } = getQuery(event);

  const greeting = await caller.greeting({ name });

  return {
    greeting
  };
}, {
  swr: true,
  maxAge: 10
});
```
