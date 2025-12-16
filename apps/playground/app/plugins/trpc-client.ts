import type { AppRouter } from '~~/server/trpc/routers';
import { httpSubscriptionLink, splitLink } from '@trpc/client';
import superjson from 'superjson';
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition: op => op.type === 'subscription',
        true: httpSubscriptionLink({
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
