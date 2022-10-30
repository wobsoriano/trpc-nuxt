import type { TRPCClientErrorLike, inferRouterProxyClient } from '@trpc/client'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AnyMutationProcedure, AnyProcedure, AnyQueryProcedure, AnyRouter, ProcedureRecord, ProcedureRouterRecord, inferHandlerInput, inferProcedureInput, inferProcedureOutput, inferRouterInputs } from '@trpc/server'
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared'
import type {
  AsyncData, AsyncDataOptions, KeyOfRes, PickFrom, _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import { hash } from 'ohash'
import type { AppRouter } from '~~/server/trpc'

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
      return useAsyncData(queryKey, () => (client as any)[path][lastArg](input), {
        ...asyncDataOptions as Record<string, any>,
        immediate: false,
      })
    }

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

export default defineNuxtPlugin(() => {
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    ],
  })

  const newClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client)
  }) as DecoratedProcedureRecord<AppRouter['_def']['record']>

  return {
    provide: {
      client: newClient,
    },
  }
})
