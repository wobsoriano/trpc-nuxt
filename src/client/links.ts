import type { HTTPBatchLinkOptions as _HTTPBatchLinkOptions, HTTPLinkOptions as _HTTPLinkOptions } from '@trpc/client';
import type { FetchEsque } from '@trpc/client/dist/internals/types';
import type { AnyTRPCRouter } from '@trpc/server';
import type { FetchError } from 'ofetch';
import {
  httpBatchLink as _httpBatchLink,
  httpLink as _httpLink,
  httpBatchStreamLink as _httpBatchStreamLink,
  httpSubscriptionLink as _httpSubscriptionLink,
} from '@trpc/client';
import { useRequestHeaders } from 'nuxt/app';
import { defaultEndpoint } from '../shared';

function isFetchError(error: unknown): error is FetchError {
  return error instanceof Error && error.name === 'FetchError';
}

async function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' }) {
  return globalThis.$fetch.raw(input.toString(), init)
    .catch((e) => {
      if (isFetchError(e) && e.response) {
        return e.response;
      }
      throw e;
    })
    .then(response => ({
      ...response,
      headers: response.headers,
      json: () => Promise.resolve(response._data),
    }));
}

export type HTTPLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPLinkOptions<TRouter['_def']['_config']['$types']> & {
  /**
   * Select headers to pass to `useRequestHeaders`.
   */
  pickHeaders?: string[];
};

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
  return _httpLink({
    ...createDefaultLinkOptions(opts?.pickHeaders),
    ...opts,
  });
}

export type HttpBatchLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPBatchLinkOptions<TRouter['_def']['_config']['$types']> & {
  /**
   * Select headers to pass to `useRequestHeaders`.
   */
  pickHeaders?: string[];
};

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
  return _httpBatchLink({
    ...createDefaultLinkOptions(opts?.pickHeaders),
    ...opts,
  });
}

/**
 * This is a convenience wrapper around the original httpBatchStreamLink
 * that replaces regular `fetch` with a `$fetch` from Nuxt. It
 * also sets the default headers based on `useRequestHeaders` values.
 *
 * During server-side rendering, calling $fetch to fetch your internal API routes
 * will directly call the relevant function (emulating the request),
 * saving an additional API call.
 *
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function httpBatchStreamLink<TRouter extends AnyTRPCRouter>(opts?: HttpBatchLinkOptions<TRouter>) {
  return _httpBatchStreamLink({
    ...createDefaultLinkOptions(opts?.pickHeaders),
    ...opts,
  });
}
