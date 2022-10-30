import { httpBatchLink } from '@trpc/client'
import { createTRPCNuxtProxyClient } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
