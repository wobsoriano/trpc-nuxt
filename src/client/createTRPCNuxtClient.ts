import type { CreateTRPCClientOptions, TRPCClientErrorLike } from '@trpc/client'
import { createTRPCClientProxy, TRPCUntypedClient } from '@trpc/client'
import { createTRPCFlatProxy, type AnyTRPCProcedure, type AnyTRPCRouter, type TRPCProcedureType, type inferProcedureInput, type inferTransformedProcedureOutput } from '@trpc/server'
import type { AsyncData, AsyncDataOptions } from 'nuxt/app'
import type { AnyRootTypes, ProcedureOptions, RouterRecord } from '@trpc/server/unstable-core-do-not-import'

import type { MaybeRefOrGetter, UnwrapRef } from 'vue'
import { createNuxtProxyDecoration } from './decorationProxy'

type PickFrom<T, K extends Array<string>> = T extends Array<any> ? T : T extends Record<string, any> ? keyof T extends K[number] ? T : K[number] extends never ? T : Pick<T, K[number]> : T
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>

type ResolverDef = {
  input: any
  output: any
  transformer: boolean
  errorShape: any
}

export type DecorateProcedure<
  TType extends TRPCProcedureType,
  TDef extends ResolverDef,
> = TType extends 'query'
  ? DecoratedQuery<TDef>
  : TType extends 'mutation'
    ? DecoratedMutation<TDef>
    : never

export type DecorateRouterRecord<
  TRoot extends AnyRootTypes,
  TRecord extends RouterRecord,
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? DecorateRouterRecord<TRoot, $Value>
      : $Value extends AnyTRPCProcedure
        ? DecorateProcedure<
          $Value['_def']['type'],
          {
            input: inferProcedureInput<$Value>
            output: inferTransformedProcedureOutput<TRoot, $Value>
            transformer: TRoot['transformer']
            errorShape: TRoot['errorShape']
          }
        >
        : never
    : never;
}

type Resolver<TDef extends ResolverDef> = (
  input: TDef['input'],
  opts?: ProcedureOptions,
) => Promise<TDef['output']>

export type DecoratedQuery<TDef extends ResolverDef> = {
  /**
   * @example
   *
   * const { data } = await $client.todo.getTodos.useQuery()
   */
  useQuery: <
    TQueryFnData extends TDef['output'] = TDef['output'],
    TData = TQueryFnData,
    PickKeys extends KeysOf<TData> = KeysOf<TData>,
  >(
    input: MaybeRefOrGetter<TDef['input']>,
    // todo: add trpc options?
    opts?: Omit<AsyncDataOptions<TQueryFnData, TData, PickKeys>, 'watch'> & {
      /**
       * The custom unique key to use.
       * @see https://nuxt.com/docs/api/composables/use-async-data#params
       */
      queryKey?: string
      watch?: AsyncDataOptions<TQueryFnData, TData, PickKeys>['watch'] | false
    }
  ) => AsyncData<PickFrom<TData, PickKeys> | null, TRPCClientErrorLike<TDef>>
  query: Resolver<TDef>
}

export type DecoratedMutation<TDef extends ResolverDef> = {
  /**
   * @example
   *
   * const { mutate } = await $client.todo.addTodo.useMutation()
   * mutate({ text: 'migrate to TRPC v11', completed: false })
   */
  useMutation: <
    TQueryFnData extends TDef['output'] = TDef['output'],
    TData = TQueryFnData,
    PickKeys extends KeysOf<TData> = KeysOf<TData>,
  >(
    opts?: Omit<AsyncDataOptions<TQueryFnData, TData, PickKeys>, 'lazy' | 'watch'>
  ) => AsyncData<PickFrom<TData, PickKeys> | null, TRPCClientErrorLike<TDef>> & {
    /**
     * The function to call to trigger the mutation.
     */
    mutate: (input: TDef['output']) => Promise<UnwrapRef<AsyncData<PickFrom<TData, PickKeys> | null, TRPCClientErrorLike<TDef>>['data']>>
  }
  mutate: Resolver<TDef>
}

export function createTRPCNuxtClient<TRouter extends AnyTRPCRouter>(opts: CreateTRPCClientOptions<TRouter>) {
  const client = new TRPCUntypedClient<TRouter>(opts)
  const proxy = createTRPCClientProxy<TRouter>(client)

  const decoratedClient = createTRPCFlatProxy((key) => {
    return createNuxtProxyDecoration(key, proxy as any)
  }) as DecorateRouterRecord<TRouter['_def']['_config']['$types'], TRouter['_def']['record']>

  return decoratedClient
}