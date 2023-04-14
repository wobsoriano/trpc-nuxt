import { httpLink as _httpLink, httpBatchLink as _httpBatchLink } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { FetchError } from 'ofetch'
// @ts-expect-error: Nuxt auto-imports
import { useRequestHeaders } from '#imports'
import { type HTTPLinkOptions as _HTTPLinkOptions } from '@trpc/client/dist/links/httpLink'
import { type FetchEsque } from '@trpc/client/dist/internals/types'

function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' })  {
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
export function httpLink<TRouter extends AnyRouter>(opts?: HTTPLinkOptions) {
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

export interface HttpBatchLinkOptions extends HTTPLinkOptions {
  maxURLLength?: number;
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
export function httpBatchLink<TRouter extends AnyRouter>(opts?: HttpBatchLinkOptions) {
  const headers = useRequestHeaders(opts?.pickHeaders)

  return _httpBatchLink<TRouter>({
    url: '/api/trpc',
    // @ts-expect-error: Missing property from batchLink. Fix this later.
    headers () {
      return headers
    },
    fetch: customFetch as FetchEsque,
    ...opts,
  })
}
