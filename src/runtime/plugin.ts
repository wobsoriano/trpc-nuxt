import * as trpc from '@trpc/client'
// @ts-expect-error: Resolved by Nuxt
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
// @ts-expect-error: Resolved by Nuxt
import type { router } from '~/server/trpc'

const config = useRuntimeConfig().public.trpc
const client = trpc.createTRPCClient<typeof router>({
  url: `${config.baseURL}${config.trpcURL}`,
  headers: useRequestHeaders(),
})

export default defineNuxtPlugin(() => {
  return {
    provide: {
      client,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $client: typeof import('~/server/trpc').router
  }
}
