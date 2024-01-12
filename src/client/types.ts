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
} from '@trpc/core'
import { type inferObservableValue, type Unsubscribable } from '@trpc/server/observable'
import { inferTransformedProcedureOutput } from '@trpc/core'
import type {
  AsyncData,
  AsyncDataOptions,
  KeysOf,
  PickFrom,
} from 'nuxt/dist/app/composables/asyncData'
import type { Ref, UnwrapRef } from 'vue'

interface TRPCRequestOptions extends _TRPCRequestOptions {
  abortOnUnmount?: boolean
}

type Resolver<TProcedure extends AnyProcedure, TRouter extends AnyRouter,> = (
  ...args: ProcedureArgs<TProcedure['_def']>
) => Promise<inferTransformedProcedureOutput<TRouter, TProcedure>>;

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

export type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
> = TProcedure extends AnyQueryProcedure
  ? {
      useQuery: <
        ResT = inferTransformedProcedureOutput<TRouter, TProcedure>,
        DataE = TRPCClientErrorLike<TRouter>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        input: MaybeRef<inferProcedureInput<TProcedure>>,
        opts?: AsyncDataOptions<ResT, DataT, PickKeys> & {
          trpc?: TRPCRequestOptions
          /**
           * The custom unique key to use.
           * @see https://nuxt.com/docs/api/composables/use-async-data#params
           */
          queryKey?: string
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | null, DataE>,
      useLazyQuery: <
        ResT = inferTransformedProcedureOutput<TRouter,TProcedure>,
        DataE = TRPCClientErrorLike<TRouter>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        input: MaybeRef<inferProcedureInput<TProcedure>>,
        opts?: Omit<AsyncDataOptions<ResT, DataT, PickKeys>, 'lazy'> & {
          trpc?: TRPCRequestOptions
          /**
           * The custom unique key to use.
           * @see https://nuxt.com/docs/api/composables/use-async-data#params
           */
          queryKey?: string
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | null, DataE>,
      query: Resolver<TProcedure, TRouter>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: Resolver<TProcedure, TRouter>
      useMutation: <
        ResT = inferTransformedProcedureOutput<TRouter, TProcedure>,
        DataE = TRPCClientErrorLike<TRouter>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        opts?: Omit<AsyncDataOptions<ResT, DataT, PickKeys>, 'lazy'> & {
          trpc?: TRPCRequestOptions
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | null, DataE> & {
        /**
         * The function to call to trigger the mutation.
         */
        mutate: (input: inferProcedureInput<TProcedure>) => Promise<UnwrapRef<AsyncData<PickFrom<DataT, PickKeys> | null, DataE>['data']>>
      },
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
