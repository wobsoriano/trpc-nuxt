import * as trpc from '@trpc/client'
// @ts-expect-error: Resolved by Nuxt
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { router } from '~/server/trpc'

type AppRouter = typeof router

const config = useRuntimeConfig().public.trpc
const client = trpc.createTRPCClient<AppRouter>({
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
    $client: trpc.TRPCClient<AppRouter>
  }
}
