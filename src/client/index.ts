import type { CreateTRPCClientOptions, inferRouterProxyClient } from '@trpc/client'
import { createTRPCProxyClient } from '@trpc/client'
import type {
  AnyRouter,
} from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import type { DecoratedProcedureRecord } from './types'
// @ts-ignore: Nuxt internal
import { useAsyncData, useState } from '#imports'

/**
 * Calculates the key used for `useAsyncData` call
 */
export function getQueryKey(
  path: string,
  input: unknown,
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}

/**
 * @internal
 */
export function createNuxtProxyDecoration<TRouter extends AnyRouter>(name: string, client: inferRouterProxyClient<TRouter>) {
  return createRecursiveProxy((opts) => {
    const args = opts.args

    const pathCopy = [name, ...opts.path]

    // The last arg is for instance `.mutate` or `.query()`

    const lastArg = pathCopy.pop()!

    const path = pathCopy.join('.')

    const [input, asyncDataOptions] = args

    const queryKey = getQueryKey(path, input)

    return useAsyncDataWithError(queryKey, () => (client as any)[path][lastArg](input), asyncDataOptions)
  })
}

/**
 * Custom useAsyncData to add server error to client
 */
async function useAsyncDataWithError(queryKey: string, cb: any, asyncDataOptions: any) {
  const serverError = useState(`error-${queryKey}`, () => null)
  const { error, data, ...rest } = await useAsyncData(queryKey, cb, asyncDataOptions)

  if (error.value && !serverError.value)
    serverError.value = error.value as any

  if (data.value)
    serverError.value = null

  return {
    ...rest,
    data,
    error: serverError,
  }
}

export function createTRPCNuxtProxyClient<TRouter extends AnyRouter>(opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCProxyClient(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client)
  }) as DecoratedProcedureRecord<TRouter['_def']['record']>

  return decoratedClient
}
