import * as trpc from '@trpc/client'
// @ts-expect-error: Resolved by Nuxt
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
// @ts-expect-error: Resolved by Nuxt
import type { router } from '~/server/trpc'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.trpc
  const client = trpc.createTRPCClient<typeof router>({
    url: `${config.baseURL}${config.trpcURL}`,
    headers: useRequestHeaders(),
  })

  return {
    provide: {
      client,
    },
  }
})
