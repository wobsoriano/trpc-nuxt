import { type CreateTRPCClientOptions, type inferRouterProxyClient, createTRPCProxyClient, httpBatchLink as _httpBatchLink } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import { nanoid } from 'nanoid'
import { type DecoratedProcedureRecord } from './types'
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData, useRequestHeaders, ref, unref } from '#imports'

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

    if (lastArg === 'useQuery') {
      const queryKey = getQueryKey(path, input)
      return useAsyncData(queryKey, () => (client as any)[path].query(input, {
        signal: controller?.signal,
        ...trpc
      }), asyncDataOptions)
    }

    if (lastArg === 'useMutation') {
      const reactiveInput = ref(null)
      const { refresh, ...result } = useAsyncData(nanoid(), () => (client as any)[path].mutate(reactiveInput.value, {
        signal: controller?.signal,
        ...trpc
      }), {
        ...asyncDataOptions,
        immediate: false
      })

      async function mutate (_input: any) {
        reactiveInput.value = _input
        await refresh()
        return unref(result.data)
      }

      return {
        mutate,
        ...result
      }
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
