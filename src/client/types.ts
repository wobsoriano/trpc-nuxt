import type { TRPCClientErrorLike, TRPCRequestOptions as _TRPCRequestOptions } from '@trpc/client'
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
import type { inferTransformedProcedureOutput } from '@trpc/server/shared'
import type { AsyncData, AsyncDataOptions } from 'nuxt/app'
import type { MaybeRefOrGetter, UnwrapRef } from 'vue'

type PickFrom<T, K extends Array<string>> = T extends Array<any> ? T : T extends Record<string, any> ? keyof T extends K[number] ? T : K[number] extends never ? T : Pick<T, K[number]> : T;
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>;

type TRPCSubscriptionObserver<TValue, TError> = {
  onStarted: () => void;
  onData: (value: TValue) => void;
  onError: (err: TError) => void;
  onStopped: () => void;
  onComplete: () => void;
}

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

export type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
> = TProcedure extends AnyQueryProcedure
  ? {
      useQuery: <
        ResT = inferTransformedProcedureOutput<TProcedure>,
        DataE = TRPCClientErrorLike<TProcedure>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
        DefaultT = null,
     >(
        input: MaybeRefOrGetter<inferProcedureInput<TProcedure>>,
        opts?: AsyncDataOptions<ResT, DataT, PickKeys, DefaultT> & {
          trpc?: TRPCRequestOptions
          /**
           * The custom unique key to use.
           * @see https://nuxt.com/docs/api/composables/use-async-data#params
           */
          queryKey?: string
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, DataE>,
      useLazyQuery: <
        ResT = inferTransformedProcedureOutput<TProcedure>,
        DataE = TRPCClientErrorLike<TProcedure>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
        DefaultT = null,
     >(
        input: MaybeRefOrGetter<inferProcedureInput<TProcedure>>,
        opts?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'> & {
          trpc?: TRPCRequestOptions
          /**
           * The custom unique key to use.
           * @see https://nuxt.com/docs/api/composables/use-async-data#params
           */
          queryKey?: string
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, DataE>,
      query: Resolver<TProcedure>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: Resolver<TProcedure>
      useMutation: <
        ResT = inferTransformedProcedureOutput<TProcedure>,
        DataE = TRPCClientErrorLike<TProcedure>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
        DefaultT = null,
     >(
        opts?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'> & {
          trpc?: TRPCRequestOptions
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, DataE> & {
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
