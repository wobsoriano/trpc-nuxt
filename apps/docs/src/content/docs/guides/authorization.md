---
title: Authorization
description: Set up with Nuxt.
---

The `createContext` function is called for each incoming request so here you can add contextual information about the calling user from the request object.

## Create context from request headers

```ts
import type { H3Event } from 'h3';
import { decodeAndVerifyJwtToken } from './somewhere/in/your/app/utils';

export async function createTRPCContext(event: H3Event) {
  // Create your context based on the event object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you might want to do in your ctx fn
  const authorization = getRequestHeader(event, 'authorization');
  async function getUserFromHeader() {
    if (authorization) {
      const user = await decodeAndVerifyJwtToken(authorization.split(' ')[1]);
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

## Option 1: Authorize using resolver

```ts
import { initTRPC, TRPCError } from '@trpc/server';

// ... context function

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  // open for anyone
  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input, ctx }) => `hello ${input ?? ctx.user?.name ?? 'world'}`),
  // checked in resolver
  secret: t.procedure.query(({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return {
      secret: 'sauce',
    };
  }),
});
```

## Option 2: Authorize using middleware

```ts
import { initTRPC, TRPCError } from '@trpc/server';

// ... context function

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user?.isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// you can reuse this for any procedure
export const protectedProcedure = t.procedure.use(isAuthed);

t.router({
  // this is accessible for everyone
  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input, ctx }) => `hello ${input ?? ctx.user?.name ?? 'world'}`),
  admin: t.router({
    // this is accessible only to admins
    secret: protectedProcedure.query(({ ctx }) => {
      return {
        secret: 'sauce',
      };
    }),
  }),
});
```
