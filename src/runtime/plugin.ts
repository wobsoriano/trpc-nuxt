import * as trpc from '@trpc/client'
// @ts-expect-error: Resolved by Nuxt
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.trpc
  const client = trpc.createTRPCClient<AppRouter>({
    url: `${config.baseURL}${config.trpcURL}`,
    headers: useRequestHeaders(),
  })

  return {
    provide: {
      client,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $client: trpc.TRPCClient<AppRouter>
  }
}
