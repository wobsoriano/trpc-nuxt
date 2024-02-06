import type { TRPCClientErrorLike, TRPCRequestOptions as _TRPCRequestOptions } from '@trpc/client'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRootTypes,
  inferProcedureInput,
  AnySubscriptionProcedure,
  inferTransformedProcedureOutput,
  RouterRecord,
  ProcedureOptions,
  inferTransformedSubscriptionOutput,
} from '@trpc/server/unstable-core-do-not-import'
import type { AsyncData, AsyncDataOptions } from 'nuxt/app'
import type { MaybeRefOrGetter, UnwrapRef } from 'vue'
import { Unsubscribable } from '@trpc/server/observable'
import { TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCUntypedClient'

type PickFrom<T, K extends Array<string>> = T extends Array<any> ? T : T extends Record<string, any> ? keyof T extends K[number] ? T : K[number] extends never ? T : Pick<T, K[number]> : T;
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>;

interface TRPCRequestOptions extends _TRPCRequestOptions {
  abortOnUnmount?: boolean
}

/** @internal */
type Resolver<
  TRoot extends AnyRootTypes,
  TProcedure extends AnyProcedure,
> = (
  input: inferProcedureInput<TProcedure>,
  opts?: ProcedureOptions,
) => Promise<inferTransformedProcedureOutput<TRoot, TProcedure>>;

type SubscriptionResolver<
  TRoot extends AnyRootTypes,
  TProcedure extends AnyProcedure,
> = (
  input: inferProcedureInput<TProcedure>,
  opts?: Partial<
    TRPCSubscriptionObserver<
      inferTransformedSubscriptionOutput<TRoot, TProcedure>,
      TRPCClientErrorLike<TRoot>
    >
  > &
    ProcedureOptions,
) => Unsubscribable;

export type DecorateProcedure<
  TRoot extends AnyRootTypes,
  TProcedure extends AnyProcedure,
> = TProcedure extends AnyQueryProcedure
  ? {
      useQuery: <
        ResT = inferTransformedProcedureOutput<TRoot, TProcedure>,
        DataE = TRPCClientErrorLike<TRoot>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        input: MaybeRefOrGetter<inferProcedureInput<TProcedure>>,
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
        ResT = inferTransformedProcedureOutput<TRoot, TProcedure>,
        DataE = TRPCClientErrorLike<TRoot>,
        DataT = ResT,
        PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
     >(
        input: MaybeRefOrGetter<inferProcedureInput<TProcedure>>,
        opts?: Omit<AsyncDataOptions<ResT, DataT, PickKeys>, 'lazy'> & {
          trpc?: TRPCRequestOptions
          /**
           * The custom unique key to use.
           * @see https://nuxt.com/docs/api/composables/use-async-data#params
           */
          queryKey?: string
        },
      ) => AsyncData<PickFrom<DataT, PickKeys> | null, DataE>,
      query: Resolver<TRoot, TProcedure>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: Resolver<TRoot, TProcedure>
      useMutation: <
        ResT = inferTransformedProcedureOutput<TRoot, TProcedure>,
        DataE = TRPCClientErrorLike<TRoot>,
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
      subscribe: SubscriptionResolver<TRoot, TProcedure>
    } : never

/**
* @internal
*/
export type DecorateRouterRecord<
  TRoot extends AnyRootTypes,
  TRecord extends RouterRecord,
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? DecorateRouterRecord<TRoot, $Value>
      : $Value extends AnyProcedure
      ? DecorateProcedure<TRoot, $Value>
      : never
    : never;
};
