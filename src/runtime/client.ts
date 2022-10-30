import type { CreateTRPCClientOptions, TRPCClientErrorLike, inferRouterProxyClient } from '@trpc/client'
import { createTRPCProxyClient } from '@trpc/client'
import { FetchError } from 'ohmyfetch'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput,
} from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import { hash } from 'ohash'

/**
 * Calculates the key used for `useAsyncData` call
 */
export function getQueryKey(
  path: string,
  input: unknown,
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}

function createNuxtProxyDecoration<TRouter extends AnyRouter>(name: string, client: inferRouterProxyClient<TRouter>) {
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
      // @ts-expect-error: Nuxt internal
      return useAsyncData(queryKey, () => (client as any)[path][lastArg](input), {
        ...asyncDataOptions as Record<string, any>,
        immediate: false,
      })
    }

    // @ts-expect-error: Nuxt internal
    return useAsyncData(queryKey, () => (client as any)[path][lastArg](input), asyncDataOptions as Record<string, any>)
  })
}

/**
 * @internal
 */
export type DecorateProcedure<
 TProcedure extends AnyProcedure,
 TPath extends string,
> = TProcedure extends AnyQueryProcedure
  ? {
      query: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys>,
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys>,
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : never

/**
* @internal
*/
export type DecoratedProcedureRecord<
 TProcedures extends ProcedureRouterRecord,
 TPath extends string = '',
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
       TProcedures[TKey]['_def']['record'],
       `${TPath}${TKey & string}.`
     >
    : TProcedures[TKey] extends AnyProcedure
      ? DecorateProcedure<TProcedures[TKey], `${TPath}${TKey & string}`>
      : never;
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
