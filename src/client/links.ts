import {
  httpLink as _httpLink,
  httpBatchLink as _httpBatchLink,
  type HTTPLinkOptions as _HTTPLinkOptions,
  type HTTPBatchLinkOptions as _HTTPBatchLinkOptions
} from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { useRequestHeaders } from 'nuxt/app'
import { type FetchEsque } from '@trpc/client/dist/internals/types'
import { type FetchError } from "ofetch";
import { defaultEndpoint } from '../shared';

function isFetchError(error: unknown): error is FetchError {
  return error instanceof Error && error.name === 'FetchError';
}

function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' })  {
  return globalThis.$fetch.raw(input.toString(), init)
    .catch((e) => {
      if (isFetchError(e) && e.response) { return e.response }
      throw e
    })
    .then(response => ({
      ...response,
      headers: response.headers,
      json: () => Promise.resolve(response._data)
    }))
}

function createDefaultLinkOptions(pickHeaders?: string[]) {
  // @ts-expect-error: Default to undefined to get all request headers
  const headers = useRequestHeaders(pickHeaders);

  return {
    url: defaultEndpoint,
    headers() {
      return headers;
    },
    fetch: customFetch as FetchEsque,
  };
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
  return _httpLink<TRouter>({
    ...createDefaultLinkOptions(opts?.pickHeaders),
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
export function httpBatchLink<TRouter extends AnyRouter>(opts?: HttpBatchLinkOptions) {
  return _httpBatchLink<TRouter>({
    ...createDefaultLinkOptions(opts?.pickHeaders),
    ...opts,
  })
}
