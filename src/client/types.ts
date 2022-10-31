import type { TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput,
} from '@trpc/server'
import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'

// Inspired by trpc/react-query client types
// https://github.com/trpc/trpc/blob/next/packages/react-query/src/createTRPCReact.tsx

interface TRPCOptions extends TRPCRequestOptions {
  abortOnUnmount?: boolean
}

/**
 * @internal
 */
export type DecorateProcedure<TProcedure extends AnyProcedure> = TProcedure extends AnyQueryProcedure
  ? {
      query: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys> & { trpc: TRPCOptions },
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys> & { trpc: TRPCOptions },
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : never

/**
* @internal
*/
export type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]['_def']['record']>
    : TProcedures[TKey] extends AnyProcedure
      ? DecorateProcedure<TProcedures[TKey]>
      : never;
}
