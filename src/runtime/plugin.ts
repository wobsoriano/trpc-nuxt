import * as trpc from '@trpc/client'
import { defineNuxtPlugin, useRequestHeaders } from '#app'
import type { router } from '~/server/trpc'

const options = JSON.parse('<%= JSON.stringify(options) %>')

export default defineNuxtPlugin(() => {
  const client = trpc.createTRPCClient<typeof router>({
    url: options.url as string,
    headers: useRequestHeaders(),
  })

  return {
    provide: {
      client,
    },
  }
})
