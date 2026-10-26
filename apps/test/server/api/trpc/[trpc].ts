import { createTRPCNuxtHandler } from 'trpc-nuxt/server/future';

import { createTRPCContext } from '../../trpc/init';
import { appRouter } from '../../trpc/routers';

export default createTRPCNuxtHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
