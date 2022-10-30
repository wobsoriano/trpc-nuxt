import { httpBatchLink } from '@trpc/client'
import { createTRPCNuxtProxyClient } from 'trpc-nuxt/client'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtProxyClient({
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
