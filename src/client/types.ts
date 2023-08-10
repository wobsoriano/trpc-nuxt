import type { TRPCClientErrorLike, TRPCRequestOptions as _TRPCRequestOptions } from '@trpc/client'
import { type TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCUntypedClient'
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
import type {
  AsyncData,
  AsyncDataOptions,
  KeysOf,
  PickFrom,
} from 'nuxt/dist/app/composables/asyncData'
import type { Ref } from 'vue'

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

type MaybeRef<T> = T | Ref<T>

type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
> = TProcedure extends AnyQueryProcedure
  ? {
      useQuery: <
      ResT = inferTransformedProcedureOutput<TProcedure>,
      DataE = TRPCClientErrorLike<TProcedure>,
      DataT = ResT,
      PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        input: MaybeRef<inferProcedureInput<TProcedure>>,
        opts?: AsyncDataOptions<ResT, DataT, PickKeys> & { trpc?: TRPCRequestOptions },
      ) => AsyncData<PickFrom<DataT, PickKeys> | null, DataE>,
      query: Resolver<TProcedure>
    } : TProcedure extends AnyMutationProcedure ? {
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
