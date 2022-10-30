import { httpBatchLink } from '@trpc/client'
import { createTRPCNuxtProxyClient } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
