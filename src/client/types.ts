import type { TRPCClientErrorLike, TRPCRequestOptions as _TRPCRequestOptions } from '@trpc/client'
import { type TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCClient'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureArgs,
  AnySubscriptionProcedure
} from '@trpc/server'
import { type inferObservableValue, type Unsubscribable } from '@trpc/server/observable'
import { inferTransformedProcedureOutput } from '@trpc/server/shared'
// import { inferTransformedProcedureOutput } from '@trpc/server/shared'
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

interface TRPCRequestOptions extends _TRPCRequestOptions {
  abortOnUnmount?: boolean
}

type Resolver<TProcedure extends AnyProcedure> = (
  ...args: ProcedureArgs<TProcedure['_def']>
) => Promise<inferTransformedProcedureOutput<TProcedure>>;

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
      useQuery: <
      TData = inferTransformedProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys> & { trpc?: TRPCRequestOptions },
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>,
      query: Resolver<TProcedure>
    } : TProcedure extends AnyMutationProcedure ? {
      useMutation: <
      TData = inferTransformedProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        opts?: AsyncDataOptions<TData, Transform, PickKeys> & { trpc?: TRPCRequestOptions },
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>> & {
        mutate: (input: inferProcedureInput<TProcedure>) => Promise<PickFrom<ReturnType<Transform>, PickKeys>>
      },
      mutate: Resolver<TProcedure>
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
