import type { CreateTRPCClientOptions, inferRouterProxyClient } from '@trpc/client'
import { createTRPCProxyClient } from '@trpc/client'
import { FetchError } from 'ohmyfetch'
import type {
  AnyRouter,
} from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import { hash } from 'ohash'
import type { DecoratedProcedureRecord } from './types'

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastArg = pathCopy.pop()!

    const path = pathCopy.join('.')

    const [input, asyncDataOptions] = args

    const queryKey = getQueryKey(path, input)

    if (lastArg === 'mutate') {
      return useAsyncDataWithError(queryKey, () => (client as any)[path][lastArg](input), {
        ...asyncDataOptions as Record<string, any>,
        immediate: false,
      })
    }

    return useAsyncDataWithError(queryKey, () => (client as any)[path][lastArg](input), asyncDataOptions)
  })
}

/**
 * Custom useAsyncData to add server error to client
 */
async function useAsyncDataWithError(queryKey: string, cb: any, asyncDataOptions: any) {
  // @ts-ignore: nuxt internal
  const serverError = useState(`error-${queryKey}`, () => null)
  // @ts-ignore: nuxt internal
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

export function customFetch(input: RequestInfo | URL, options?: RequestInit) {
  return globalThis.$fetch.raw(input.toString(), options)
    .catch((e) => {
      if (e instanceof FetchError && e.response)
        return e.response

      throw e
    })
    .then(response => ({
      ...response,
      json: () => Promise.resolve(response._data),
    }))
}
