import * as trpc from '@trpc/client'
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.trpc
  const headers = useRequestHeaders()
  const client = trpc.createTRPCClient<AppRouter>({
    url: `${config.baseURL}${config.trpcURL}`,
    headers: () => {
      let otherHeaders = {}
      if (!process.server) {
        const key = 'trpc-nuxt-header'
        otherHeaders = JSON.parse(localStorage.getItem(key) || JSON.stringify({}))
      }

      return {
        ...otherHeaders,
        ...headers,
      }
    },
  })

  nuxtApp.provide('client', client)
})

declare module '#app' {
  interface NuxtApp {
    $client: trpc.TRPCClient<AppRouter>
  }
}
