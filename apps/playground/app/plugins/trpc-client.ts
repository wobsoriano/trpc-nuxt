import { httpSubscriptionLink, splitLink } from '@trpc/client';
import superjson from 'superjson';
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import type { AppRouter } from '~~/server/trpc/routers';

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
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
