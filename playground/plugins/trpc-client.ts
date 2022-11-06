import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNuxtProxyClient } from 'trpc-nuxt/client'
import superjson from 'superjson'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      // adds pretty logs to your console in development and logs errors in production
      loggerLink({
        enabled: opts =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error)
      }),
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc'
      })
    ]
  })

  return {
    provide: {
      client
    }
  }
})
