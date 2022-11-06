import type { CreateTRPCClientOptions, inferRouterProxyClient } from '@trpc/client'
import { createTRPCProxyClient } from '@trpc/client'
import type {
  AnyRouter
} from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import { nanoid } from 'nanoid'
import type { DecoratedProcedureRecord } from './types'
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData } from '#imports'

/**
 * Calculates the key used for `useAsyncData` call
 */
export function getQueryKey (
  path: string,
  input: unknown
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}

function createNuxtProxyDecoration<TRouter extends AnyRouter> (name: string, client: inferRouterProxyClient<TRouter>) {
  return createRecursiveProxy((opts) => {
    const args = opts.args

    const pathCopy = [name, ...opts.path]

    // The last arg is for instance `.mutate` or `.query()`
    const lastArg = pathCopy.pop()!

    const path = pathCopy.join('.')

    const [input, otherOptions] = args

    const queryKey = lastArg === 'mutate' ? nanoid() : getQueryKey(path, input)

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

    return useAsyncData(queryKey, () => (client as any)[path][lastArg](input, {
      signal: controller?.signal,
      ...trpc
    }), asyncDataOptions)
  })
}

export function createTRPCNuxtProxyClient<TRouter extends AnyRouter> (opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCProxyClient(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client)
  }) as DecoratedProcedureRecord<TRouter['_def']['record'], TRouter>

  return decoratedClient
}
