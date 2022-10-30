import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNuxtProxyClient } from 'trpc-nuxt/client'
import superjson from 'superjson'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin((nuxtApp) => {
  const client = createTRPCNuxtProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      // adds pretty logs to your console in development and logs errors in production
      loggerLink({
        enabled: opts =>
          process.env.NODE_ENV === 'development'
          || (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
        /**
           * Set custom request headers on every request from tRPC
           * @link https://trpc.io/docs/ssr
           */
        headers() {
          if (nuxtApp.ssrContext?.event?.req) {
            // To use SSR properly, you need to forward the client's headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering

            // If you're using Node 18, omit the "connection" header
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              connection: _connection,
              ...headers
            } = nuxtApp.ssrContext.event.req.headers
            return {
              ...headers,
              // Optional: inform server that it's an SSR request
              'x-ssr': '1',
            }
          }
          return {}
        },
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
