import type { AppRouter } from '~~/server/trpc/routers';
import { isNonJsonSerializable, splitLink } from '@trpc/client';
import superjson from 'superjson';
import { createTRPCNuxtClient, httpBatchLink, httpLink } from 'trpc-nuxt/client';

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      // Example to make formdata work
      splitLink({
        condition: op => isNonJsonSerializable(op.input),
        true: httpLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
        false: httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
