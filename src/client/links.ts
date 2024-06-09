import {
  httpLink as _httpLink,
  httpBatchLink as _httpBatchLink,
  type HTTPLinkOptions as _HTTPLinkOptions,
  type HTTPBatchLinkOptions as _HTTPBatchLinkOptions
} from '@trpc/client'
import { FetchError } from 'ofetch'
// @ts-expect-error: Nuxt auto-imports
import { useRequestHeaders } from '#imports'
import { AnyTRPCRouter } from '@trpc/server'
import { FetchEsque } from '@trpc/client/dist/internals/types'

function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' })  {
  return globalThis.$fetch.raw(input.toString(), init)
    .catch((e) => {
      if (e instanceof FetchError && e.response) { return e.response }
      throw e
    })
    .then(response => ({
      ...response,
      headers: response.headers,
      json: () => Promise.resolve(response._data)
    }))
}

export interface HTTPLinkOptions extends _HTTPLinkOptions {
  /**
   * Select headers to pass to `useRequestHeaders`.
   */
  pickHeaders?: string[]
}

/**
 * This is a convenience wrapper around the original httpLink
 * that replaces regular `fetch` with a `$fetch` from Nuxt. It
 * also sets the default headers based on `useRequestHeaders` values.
 *
 * During server-side rendering, calling $fetch to fetch your internal API routes
 * will directly call the relevant function (emulating the request),
 * saving an additional API call.
 *
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function httpLink<TRouter extends AnyTRPCRouter>(opts?: HTTPLinkOptions) {
  const headers = useRequestHeaders(opts?.pickHeaders)

  return _httpLink<TRouter>({
    url: '/api/trpc',
    headers () {
      return headers
    },
    fetch: customFetch as FetchEsque,
    ...opts,
  })
}

export interface HttpBatchLinkOptions extends _HTTPBatchLinkOptions {
  /**
   * Select headers to pass to `useRequestHeaders`.
   */
  pickHeaders?: string[]
}


/**
 * This is a convenience wrapper around the original httpBatchLink
 * that replaces regular `fetch` with a `$fetch` from Nuxt. It
 * also sets the default headers based on `useRequestHeaders` values.
 *
 * During server-side rendering, calling $fetch to fetch your internal API routes
 * will directly call the relevant function (emulating the request),
 * saving an additional API call.
 *
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function httpBatchLink<TRouter extends AnyTRPCRouter>(opts?: HttpBatchLinkOptions) {
  const headers = useRequestHeaders(opts?.pickHeaders)

  return _httpBatchLink<TRouter>({
    url: '/api/trpc',
    headers () {
      return headers
    },
    fetch: customFetch as FetchEsque,
    ...opts,
  })
}
