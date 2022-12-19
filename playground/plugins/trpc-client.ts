import { loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      // adds pretty logs to your console in development and logs errors in production
      loggerLink({
        enabled: opts =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error)
      }),
      httpBatchLink()
    ]
  })

  return {
    provide: {
      client
    }
  }
})
