import type { TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import type { TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCClient'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  AnySubscriptionProcedure,
  ProcedureArgs,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput
} from '@trpc/server'
import type { Unsubscribable, inferObservableValue } from '@trpc/server/observable'
import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform
} from 'nuxt/dist/app/composables/asyncData'

// Modified @trpc/client and @trpc/react-query types
// https://github.com/trpc/trpc/blob/next/packages/client/src/createTRPCClientProxy.ts
// https://github.com/trpc/trpc/blob/next/packages/react-query/src/createTRPCReact.tsx

interface TRPCOptions extends TRPCRequestOptions {
  abortOnUnmount?: boolean
}

type SubscriptionResolver<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
> = (
  ...args: [
    input: ProcedureArgs<TProcedure['_def']>[0],
    opts: ProcedureArgs<TProcedure['_def']>[1] &
    Partial<
        TRPCSubscriptionObserver<
          inferObservableValue<inferProcedureOutput<TProcedure>>,
          TRPCClientErrorLike<TRouter>
        >
      >,
  ]
) => Unsubscribable

type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
> = TProcedure extends AnyQueryProcedure
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
    } : TProcedure extends AnySubscriptionProcedure ? {
      subscribe: SubscriptionResolver<TProcedure, TRouter>
    } : never

/**
* @internal
*/
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TRouter extends AnyRouter,
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]['_def']['record'], TRouter>
    : TProcedures[TKey] extends AnyProcedure
      ? DecorateProcedure<TProcedures[TKey], TRouter>
      : never;
}
