import type { CreateTRPCClientOptions, OperationContext, TRPCClientError, TRPCClientErrorLike, TRPCProcedureOptions, TRPCRequestOptions } from '@trpc/client';
import type { TRPCConnectionState } from '@trpc/client/unstable-internals';
import type { AnyTRPCProcedure, AnyTRPCRootTypes, AnyTRPCRouter, inferProcedureInput, inferTransformedProcedureOutput, TRPCProcedureType } from '@trpc/server';
import type { Unsubscribable } from '@trpc/server/observable';
import type { inferAsyncIterableYield, RouterRecord } from '@trpc/server/unstable-core-do-not-import';

import type { AsyncData, AsyncDataOptions } from 'nuxt/app';
import type { MaybeRefOrGetter, Ref, ShallowRef, UnwrapRef } from 'vue';
import type { AsyncDataExecuteOptions, KeysOf, PickFrom } from './nuxt-types';
import { createTRPCClientProxy, createTRPCUntypedClient } from '@trpc/client';
import { createTRPCFlatProxy } from '@trpc/server';
import { createNuxtProxyDecoration } from './decoration-proxy';

interface ResolverDef {
  input: any;
  output: any;
  transformer: boolean;
  errorShape: any;
}

// Extracted from https://github.com/trpc/trpc/blob/5597551257ad8d83dbca7272cc6659756896bbda/packages/client/src/internals/TRPCUntypedClient.ts#L32
interface TRPCSubscriptionObserver<TValue, TError> {
  onStarted: (opts: { context: OperationContext | undefined }) => void;
  onData: (value: inferAsyncIterableYield<TValue>) => void;
  onError: (err: TError) => void;
  onStopped: () => void;
  onComplete: () => void;
  onConnectionStateChange: (state: TRPCConnectionState<TError>) => void;
}

type SubscriptionResolver<TDef extends ResolverDef> = (
  input: TDef['input'],
  opts?: Partial<
    TRPCSubscriptionObserver<TDef['output'], TRPCClientError<TDef>>
  >
  & TRPCProcedureOptions,
) => Unsubscribable;

type SubscriptionStatus = 'idle' | 'connecting' | 'pending' | 'error';

export interface UseSubscriptionOptions<TOutput, TError> {
  enabled?: MaybeRefOrGetter<boolean>;
  onStarted?: (opts: { context: OperationContext | undefined }) => void;
  onData?: (data: TOutput) => void;
  onError?: (error: TError) => void;
  onComplete?: () => void;
  onConnectionStateChange?: (state: TRPCConnectionState<TError>) => void;
  onStopped?: () => void;
  trpc?: TRPCRequestOptions;
}

export interface UseSubscriptionReturn<TOutput, TError> {
  status: Ref<SubscriptionStatus>;
  data: ShallowRef<TOutput | undefined>;
  error: ShallowRef<TError | null>;
  reset: () => void;
}

export interface DecoratedSubscription<TDef extends ResolverDef> {
  /**
   * @example
   *
   * const { status, data, error } = $trpc.chat.onMessage.useSubscription(
   *   () => ({ roomId: props.roomId }),
   *   {
   *     onData: (message) => {
   *       messages.value.push(message);
   *     },
   *   }
   * );
   */
  useSubscription: (
    input: MaybeRefOrGetter<TDef['input']>,
    opts?: UseSubscriptionOptions<
      inferAsyncIterableYield<TDef['output']>,
      TRPCClientError<TDef>
    >
  ) => UseSubscriptionReturn<
    inferAsyncIterableYield<TDef['output']>,
    TRPCClientError<TDef>
  >;
  subscribe: SubscriptionResolver<TDef>;
}

export type DecorateProcedure<
  TType extends TRPCProcedureType,
  TDef extends ResolverDef,
> = TType extends 'query'
  ? DecoratedQuery<TDef>
  : TType extends 'mutation'
    ? DecoratedMutation<TDef>
    : TType extends 'subscription'
      ? DecoratedSubscription<TDef>
      : never;

export type DecorateRouterRecord<
  TRoot extends AnyTRPCRootTypes,
  TRecord extends RouterRecord,
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? DecorateRouterRecord<TRoot, $Value>
      : $Value extends AnyTRPCProcedure
        ? DecorateProcedure<
          $Value['_def']['type'],
          {
            input: inferProcedureInput<$Value>;
            output: inferTransformedProcedureOutput<TRoot, $Value>;
            transformer: TRoot['transformer'];
            errorShape: TRoot['errorShape'];
          }
        >
        : never
    : never;
};

type Resolver<TDef extends ResolverDef> = (
  input: TDef['input'],
  opts?: TRPCProcedureOptions,
) => Promise<TDef['output']>;

export interface DecoratedQuery<TDef extends ResolverDef> {
  /**
   * @example
   *
   * const { data } = await $trpc.todo.getTodos.useQuery()
   */
  useQuery: <
    TQueryFnData extends TDef['output'] = TDef['output'],
    TData = TQueryFnData,
    PickKeys extends KeysOf<TData> = KeysOf<TData>,
    DefaultT = undefined,
  >(
    input: MaybeRefOrGetter<TDef['input']>,
    // todo: add trpc options?
    opts?: Omit<AsyncDataOptions<TQueryFnData, TData, PickKeys>, 'watch'> & {
      /**
       * The custom unique key to use.
       * @see https://nuxt.com/docs/4.x/api/composables/use-async-data#params
       */
      queryKey?: string;
      watch?: AsyncDataOptions<TQueryFnData, TData, PickKeys>['watch'] | false;
      trpc?: TRPCRequestOptions;
    }
  ) => AsyncData<PickFrom<TData, PickKeys> | DefaultT, TRPCClientErrorLike<TDef>>;
  query: Resolver<TDef>;
}

export interface DecoratedMutation<TDef extends ResolverDef> {
  /**
   * @example
   *
   * const { mutate } = $trpc.todo.addTodo.useMutation()
   * mutate({ text: 'migrate to TRPC v11', completed: false })
   */
  useMutation: <
    TQueryFnData extends TDef['output'] = TDef['output'],
    TData = TQueryFnData,
    PickKeys extends KeysOf<TData> = KeysOf<TData>,
    DefaultT = undefined,
  >(
    opts?: Omit<AsyncDataOptions<TQueryFnData, TData, PickKeys>, 'lazy' | 'watch' | 'server' | 'immediate'> & {
      /**
       * The custom unique key to use.
       * @see https://nuxt.com/docs/4.x/api/composables/use-async-data#params
       */
      mutationKey?: string;
      trpc?: TRPCRequestOptions;
    }
  ) => AsyncData<PickFrom<TData, PickKeys> | DefaultT, TRPCClientErrorLike<TDef>> & {
    /**
     * The function to call to trigger the mutation.
     */
    mutate: (input: TDef['input'], opts?: AsyncDataExecuteOptions) => Promise<UnwrapRef<AsyncData<PickFrom<TData, PickKeys> | DefaultT, TRPCClientErrorLike<TDef>>['data']>>;
  };
  mutate: Resolver<TDef>;
}

export function createTRPCNuxtClient<TRouter extends AnyTRPCRouter>(opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCUntypedClient<TRouter>(opts);
  const proxy = createTRPCClientProxy<TRouter>(client);

  const decoratedClient = createTRPCFlatProxy<
    DecorateRouterRecord<TRouter['_def']['_config']['$types'], TRouter['_def']['record']>
  >((key) => {
    return createNuxtProxyDecoration(key, proxy);
  });

  return decoratedClient;
}
