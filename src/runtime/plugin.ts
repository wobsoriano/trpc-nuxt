import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { TRPCClient } from '@trpc/client';
import { unref } from 'vue'
import { FetchError } from 'ohmyfetch'
import { useClientHeaders } from './client'
import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app'
import type { AppRouter } from '~/server/trpc'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.trpc
  const headers = useRequestHeaders()
  const otherHeaders = useClientHeaders()

  const baseURL = process.server ? '' : config.baseURL
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseURL}${config.endpoint}`,
        headers: () => {
          return {
            ...unref(otherHeaders),
            ...headers,
          }
        },
        fetch: (input, options) =>
          globalThis.$fetch.raw(input.toString(), options)
            .catch((e) => {
              if (e instanceof FetchError && e.response)
                return e.response

              throw e
            })
            .then(response => ({
              ...response,
              json: () => Promise.resolve(response._data),
            })),
      }),
    ],
  })

  nuxtApp.provide('client', client)
})

declare module '#app' {
  interface NuxtApp {
    $client: TRPCClient<any>
  }
}
