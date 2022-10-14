import * as trpc from '@trpc/client'
import { unref } from 'vue'
import { FetchError } from 'ohmyfetch'
import { useClientHeaders } from './client'
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { router } from '~/server/trpc'

declare type AppRouter = typeof router

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.trpc
  const headers = useRequestHeaders()
  const otherHeaders = useClientHeaders()

  const baseURL = process.server ? '' : config.baseURL

  const client = trpc.createTRPCClient<AppRouter>({
    url: `${baseURL}${config.endpoint}`,
    headers: () => {
      return {
        ...unref(otherHeaders),
        ...headers,
      }
    },
    fetch: async (input, options) => {
      try {
        const response = await globalThis.$fetch.raw(input.toString(), options)

        return {
          ...response,
          json: () => Promise.resolve(response._data),
        }
      }
      catch (e) {
        if (e instanceof FetchError && e.response)
          return e.response

        throw e
      }
    },
    transformer: config.transformer,
  })

  nuxtApp.provide('client', client)
})

declare module '#app' {
  interface NuxtApp {
    $client: trpc.TRPCClient<AppRouter>
  }
}
