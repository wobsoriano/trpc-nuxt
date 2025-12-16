import type { AppRouter } from '~~/server/trpc/routers';
import { httpSubscriptionLink, isNonJsonSerializable, splitLink } from '@trpc/client';
import { createTRPCNuxtClient, httpBatchLink, httpLink } from 'trpc-nuxt/client';
import { superjson } from '~/shared/superjson';

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition: op => op.type === 'subscription',
        true: httpSubscriptionLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
        false: splitLink({
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
      }),
    ],
  });

  return {
    provide: {
      trpc,
    },
  };
});
