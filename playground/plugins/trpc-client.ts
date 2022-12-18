import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { FetchError } from 'ofetch'
import { createTRPCNuxtClient } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()
  // const client = createTRPCProxyClient<AppRouter>({
  //   transformer: superjson,
  //   links: [
  //     // adds pretty logs to your console in development and logs errors in production
  //     loggerLink({
  //       enabled: opts =>
  //         process.env.NODE_ENV === 'development' ||
  //         (opts.direction === 'down' && opts.result instanceof Error)
  //     }),
  //     httpBatchLink({
  //       url: '/api/trpc',
  //       headers () {
  //         return headers
  //       },
  //       fetch: (input, options) =>
  //         globalThis.$fetch.raw(input.toString(), options)
  //           .catch((e) => {
  //             if (e instanceof FetchError && e.response) { return e.response }
  //             throw e
  //           })
  //           .then(response => ({
  //             ...response,
  //             json: () => Promise.resolve(response._data)
  //           }))
  //     })
  //   ]
  // })
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      // adds pretty logs to your console in development and logs errors in production
      // loggerLink({
      //   enabled: opts =>
      //     process.env.NODE_ENV === 'development' ||
      //     (opts.direction === 'down' && opts.result instanceof Error)
      // }),
      httpBatchLink({
        url: '/api/trpc',
        headers () {
          return headers
        },
        fetch: (input, options) =>
          $fetch.raw(input.toString(), options)
            .catch((e) => {
              if (e instanceof FetchError && e.response) { return e.response }
              throw e
            })
            .then(response => ({
              ...response,
              json: () => Promise.resolve(response._data)
            }))
      })
    ]
  })

  return {
    provide: {
      client
    }
  }
})
