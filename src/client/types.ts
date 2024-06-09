import type { TRPCClientErrorLike, TRPCRequestOptions as _TRPCRequestOptions } from '@trpc/client'
import { type TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCUntypedClient'
import type {
  inferProcedureInput,
  inferProcedureOutput,
  AnyTRPCSubscriptionProcedure,
  AnyTRPCProcedure,
  AnyTRPCQueryProcedure,
  AnyTRPCMutationProcedure,
  AnyTRPCRouter
} from '@trpc/server'
import { type inferObservableValue, type Unsubscribable } from '@trpc/server/observable'
import { inferTransformedProcedureOutput } from '@trpc/server'
import type { AsyncData, AsyncDataOptions } from 'nuxt/app'
import type { KeysOf, PickFrom } from 'nuxt/dist/app/composables/asyncData'
import type { Ref, UnwrapRef } from 'vue'

interface TRPCRequestOptions extends _TRPCRequestOptions {
  abortOnUnmount?: boolean
}

type Resolver<TProcedure extends AnyTRPCProcedure, TRouter extends AnyTRPCRouter> = (
  ...args: ProcedureArgs<TProcedure['_def']>
) => Promise<inferTransformedProcedureOutput<TRouter, TProcedure>>;

type SubscriptionResolver<
  TProcedure extends AnyTRPCProcedure,
  TRouter extends AnyTRPCRouter,
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
  TProcedure extends AnyTRPCProcedure,
  TRouter extends AnyTRPCRouter,
> = TProcedure extends AnyTRPCQueryProcedure
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
    } : TProcedure extends AnyTRPCMutationProcedure ? {
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
    } : TProcedure extends AnyTRPCSubscriptionProcedure ? {
      subscribe: SubscriptionResolver<TProcedure, TRouter>
    } : never

/**
* @internal
*/
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TRouter extends AnyTRPCRouter,
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyTRPCRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]['_def']['record'], TRouter>
    : TProcedures[TKey] extends AnyTRPCProcedure
      ? DecorateProcedure<TProcedures[TKey], TRouter>
      : never;
}
