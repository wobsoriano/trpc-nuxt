import * as trpc from '@trpc/client'
import { unref } from 'vue'
import { useClientHeaders } from './client'
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.trpc
  const headers = useRequestHeaders()
  const otherHeaders = useClientHeaders()
  const client = trpc.createTRPCClient<AppRouter>({
    url: `${config.baseURL}${config.trpcURL}`,
    headers: () => {
      return {
        ...unref(otherHeaders),
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
