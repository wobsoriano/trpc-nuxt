import { createTRPCNuxtHandler } from 'trpc-nuxt/server';
import { createTRPCContext } from '../../trpc/init';
import { appRouter } from '../../trpc/routers';

export default createTRPCNuxtHandler({
  // endpoint: '/api/trpc',
  router: appRouter,
  createContext: createTRPCContext,
});
