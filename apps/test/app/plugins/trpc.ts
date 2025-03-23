import type { AppRouter } from '../../server/trpc/routers';
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import { superjson } from '~/shared/superjson';

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [httpBatchLink({ transformer: superjson })],
  });

  return {
    provide: {
      trpc,
    },
  };
});
