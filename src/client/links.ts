import {
  httpLink as _httpLink,
  httpBatchLink as _httpBatchLink,
  type HTTPLinkOptions as _HTTPLinkOptions,
  type HTTPBatchLinkOptions as _HTTPBatchLinkOptions,
} from '@trpc/client'
import type { FetchError } from 'ofetch'
import type { AnyTRPCRouter } from '@trpc/server'
import type { FetchEsque } from '@trpc/client/dist/internals/types'
import { defaultEndpoint } from '../utils'
// @ts-expect-error: Nuxt auto-imports
import { useRequestHeaders } from '#imports'

function isFetchError(error: unknown): error is FetchError {
  return error instanceof Error && error.name === 'FetchError'
}

async function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' }) {
  return globalThis.$fetch.raw(input.toString(), init)
    .catch((e) => {
      if (isFetchError(e) && e.response) {
        return e.response
      }
      throw e
    })
    .then(response => ({
      ...response,
      headers: response.headers,
      json: () => Promise.resolve(response._data),
    }))
}

export type HTTPLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPLinkOptions<TRouter['_def']['_config']['$types']> & {
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
export function httpLink<TRouter extends AnyTRPCRouter = AnyTRPCRouter>(opts?: HTTPLinkOptions<TRouter>) {
  const headers = useRequestHeaders(opts?.pickHeaders)

  return _httpLink({
    url: defaultEndpoint,
    headers() {
      return headers
    },
    fetch: customFetch as FetchEsque,
    ...opts,
  })
}

export type HttpBatchLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPBatchLinkOptions<TRouter['_def']['_config']['$types']> & {
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
export function httpBatchLink<TRouter extends AnyTRPCRouter>(opts?: HttpBatchLinkOptions<TRouter>) {
  const headers = useRequestHeaders(opts?.pickHeaders)

  return _httpBatchLink({
    url: defaultEndpoint,
    headers() {
      return headers
    },
    fetch: customFetch as FetchEsque,
    ...opts,
  })
}
