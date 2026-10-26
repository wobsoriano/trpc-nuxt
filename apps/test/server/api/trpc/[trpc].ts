import { defineEventHandler } from 'nuxt/server';
import { createTRPCNuxtHandler } from 'trpc-nuxt/server/nuxt';

import { createTRPCContext } from '../../trpc/init';
import { appRouter } from '../../trpc/routers';

export default defineEventHandler(
  createTRPCNuxtHandler({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);
