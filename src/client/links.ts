import type { HTTPBatchLinkOptions as _HTTPBatchLinkOptions, HTTPLinkOptions as _HTTPLinkOptions } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import type { FetchError, FetchOptions } from 'ofetch';
import {
  httpBatchLink as _httpBatchLink,
  httpBatchStreamLink as _httpBatchStreamLink,
  httpLink as _httpLink,
} from '@trpc/client';
import { useRequestHeaders } from 'nuxt/app';
import { defaultEndpoint } from '../shared';

function isFetchError(error: unknown): error is FetchError {
  return error instanceof Error && error.name === 'FetchError';
}

type FetchEsque = (
  input: RequestInfo | URL | string,
  init?: RequestInit | Request,
) => Promise<Response>;

function createCustomFetch(fetchOptions?: FetchOptions) {
  return async function customFetch(input: RequestInfo | URL, init?: RequestInit & { method: 'GET' }) {
    return globalThis.$fetch.create(fetchOptions ?? {}).raw(input.toString(), init).catch((e) => {
      if (isFetchError(e) && e.response) {
        return e.response;
      }
      throw e;
    }).then(response => ({
      ...response,
      headers: response.headers,
      json: () => Promise.resolve(response._data),
    }
    ));
  } as FetchEsque;
}

interface DefaultLinkOptionsParams {
  /**
   * Select headers to pass to `useRequestHeaders`.
   */
  pickHeaders?: string[];

  /**
   * ofetch fetch options.
   * @see https://github.com/unjs/ofetch
   */
  fetchOptions?: FetchOptions;
}

export type HTTPLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPLinkOptions<TRouter['_def']['_config']['$types']>
  & DefaultLinkOptionsParams;

function createDefaultLinkOptions(params: DefaultLinkOptionsParams) {
  // @ts-expect-error: Default to undefined to get all request headers
  const headers = useRequestHeaders(params.pickHeaders);

  return {
    url: defaultEndpoint,
    headers() {
      return headers;
    },
    fetch: createCustomFetch(params.fetchOptions),
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
    ...createDefaultLinkOptions({ pickHeaders: opts?.pickHeaders, fetchOptions: opts?.fetchOptions }),
    ...opts,
  } as any);
}

export type HttpBatchLinkOptions<TRouter extends AnyTRPCRouter> = _HTTPBatchLinkOptions<TRouter['_def']['_config']['$types']>
  & DefaultLinkOptionsParams;

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
    ...createDefaultLinkOptions({ pickHeaders: opts?.pickHeaders, fetchOptions: opts?.fetchOptions }),
    ...opts,
  } as any);
}
