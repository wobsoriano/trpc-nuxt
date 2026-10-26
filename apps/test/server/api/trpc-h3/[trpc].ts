import type { H3Event } from 'h3';
import { createTRPCNuxtHandler } from 'trpc-nuxt/server';

import type { Context } from '../../trpc/init';
import { appRouter } from '../../trpc/routers';

export default createTRPCNuxtHandler({
  router: appRouter,
  endpoint: '/api/trpc-h3',
  createContext: (event: H3Event): Context => {
    const { userId } = event.context.auth;
    return { userId };
  },
});
