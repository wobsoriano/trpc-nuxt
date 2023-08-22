import { type CreateTRPCClientOptions, type inferRouterProxyClient, createTRPCProxyClient } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import { type DecoratedProcedureRecord } from './types'
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData, unref, isRef } from '#imports'

/**
 * Calculates the key used for `useAsyncData` call.
 *
 * @example
 *
 * ```ts
 * import { getQueryKey } from 'trpc-nuxt/client'
 *
 * $client.todo.getTodo(1)
 * 
 * const queryKey = getQueryKey('todo.getTodo', 1)
 * ```
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

    if (['useQuery', 'useLazyQuery'].includes(lastArg)) {
      const { trpc, queryKey: customQueryKey, ...asyncDataOptions } = otherOptions || {} as any

      let controller: AbortController

      if (trpc?.abortOnUnmount) {
        if (getCurrentInstance()) {
          onScopeDispose(() => {
            controller?.abort?.()
          })
        }
        controller = typeof AbortController !== 'undefined' ? new AbortController() : {} as AbortController
      }

      const queryKey = customQueryKey || getQueryKey(path, unref(input))
      const watch = isRef(input) ? [...(asyncDataOptions.watch || []), input] : asyncDataOptions.watch
      const isLazy = lastArg === 'useLazyQuery' ? true : (asyncDataOptions.lazy || false)
  
      return useAsyncData(queryKey, () => (client as any)[path].query(unref(input), {
        signal: controller?.signal,
        ...trpc
      }), {
        ...asyncDataOptions,
        watch,
        lazy: isLazy
      })
    }

    return (client as any)[path][lastArg](...args)
  })
}

export function createTRPCNuxtClient<TRouter extends AnyRouter> (opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCProxyClient<TRouter>(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client as any)
  }) as DecoratedProcedureRecord<TRouter['_def']['record'], TRouter>

  return decoratedClient
}

export {
  httpBatchLink,
  httpLink
} from './links'
