import { type CreateTRPCClientOptions, type inferRouterProxyClient, createTRPCProxyClient, httpLink as _httpLink, httpBatchLink as _httpBatchLink, HttpBatchLinkOptions } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import { FetchError } from 'ofetch'
import { type DecoratedProcedureRecord } from './types'
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData, useRequestHeaders } from '#imports'
import { HTTPLinkOptions } from '@trpc/client/dist/links/internals/httpUtils'

/**
 * Calculates the key used for `useAsyncData` call
 */
export function getQueryKey (
  path: string,
  input: unknown
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}

export function createNuxtProxyDecoration<TRouter extends AnyRouter> (name: string, client: inferRouterProxyClient<TRouter>) {
  return createRecursiveProxy((opts) => {
    const args = opts.args

    const pathCopy = [name, ...opts.path]

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join('.')

    const [input, otherOptions] = args

    if (lastArg === 'useQuery') {
      const { trpc, ...asyncDataOptions } = otherOptions || {} as any

      let controller: AbortController

      if (trpc?.abortOnUnmount) {
        if (getCurrentInstance()) {
          onScopeDispose(() => {
            controller?.abort?.()
          })
        }
        controller = typeof AbortController !== 'undefined' ? new AbortController() : {} as AbortController
      }

      const queryKey = getQueryKey(path, input)
      return useAsyncData(queryKey, () => (client as any)[path].query(input, {
        signal: controller?.signal,
        ...trpc
      }), asyncDataOptions)
    }

    return (client as any)[path][lastArg](input)
  })
}

export function createTRPCNuxtClient<TRouter extends AnyRouter> (opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCProxyClient<TRouter>(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client)
  }) as DecoratedProcedureRecord<TRouter['_def']['record'], TRouter>

  return decoratedClient
}

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
