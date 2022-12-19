import { httpLink as _httpLink, httpBatchLink as _httpBatchLink, HttpBatchLinkOptions } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { FetchError } from 'ofetch'
// @ts-expect-error: Nuxt auto-imports
import { useRequestHeaders } from '#imports'
import { type HTTPLinkOptions } from '@trpc/client/dist/links/internals/httpUtils'

function customFetch(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return globalThis.$fetch.raw(input.toString(), init)
    .catch((e) => {
      if (e instanceof FetchError && e.response) { return e.response }
      throw e
    })
    .then(response => ({
      ...response,
      json: () => Promise.resolve(response._data)
    }))
}

/**
 * This is a convenience wrapper around the original httpLink
 * that replaces regular `fetch` with a `$fetch` from Nuxt.
 *
 * During server-side rendering, calling $fetch to fetch your internal API routes
 * will directly call the relevant function (emulating the request),
 * saving an additional API call.
 *
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function httpLink<TRouter extends AnyRouter>(opts?: HTTPLinkOptions) {
  const headers = useRequestHeaders()

  return _httpLink<TRouter>({
    url: '/api/trpc',
    headers () {
      return headers
    },
    fetch: customFetch,
    ...opts,
  })
}


/**
 * This is a convenience wrapper around the original httpBatchLink
 * that replaces regular `fetch` with a `$fetch` from Nuxt.
 *
 * During server-side rendering, calling $fetch to fetch your internal API routes
 * will directly call the relevant function (emulating the request),
 * saving an additional API call.
 *
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function httpBatchLink<TRouter extends AnyRouter>(opts?: HttpBatchLinkOptions) {
  const headers = useRequestHeaders()

  return _httpBatchLink<TRouter>({
    url: '/api/trpc',
    headers () {
      return headers
    },
    fetch: customFetch,
    ...opts,
  })
}
