import { objectHash } from 'ohash'
import type { TRPCClient } from '@trpc/client'
import type { AnyRouter, inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { AsyncData, KeyOfRes, PickFrom, _Transform } from 'nuxt/dist/app/composables/asyncData'
// @ts-expect-error: Resolved by Nuxt
import { useAsyncData, useLazyAsyncData } from '#imports'

export function createTRPCComposables<
  Router extends AnyRouter,
  Client extends TRPCClient<Router> = TRPCClient<Router>,
  TQuery extends keyof Router['_def']['queries'] = keyof Router['_def']['queries'],
  TMutation extends keyof Router['_def']['mutations'] = keyof Router['_def']['mutations'],
>(
  client: Client
): {
  useTrpcQuery: <
    TRouteKey extends TQuery,
    ProcedureInput = inferProcedureInput<Router['_def']['queries'][TRouteKey]>,
    ProcedureOutput = inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
  >(
    path: TRouteKey,
    input: ProcedureInput
  ) => AsyncData<
    PickFrom<
      ProcedureOutput,
      KeyOfRes<_Transform<ProcedureOutput, ProcedureOutput>>
    >,
    true | Error
  >
  useLazyTrpcQuery: <
    TRouteKey extends TQuery,
    ProcedureInput = inferProcedureInput<Router['_def']['queries'][TRouteKey]>,
    ProcedureOutput = inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
  >(
    path: TRouteKey,
    input: ProcedureInput
  ) => AsyncData<
    PickFrom<
      ProcedureOutput,
      KeyOfRes<_Transform<ProcedureOutput, ProcedureOutput>>
    >,
    true | Error
  >
  useTrpcMutation: <
    TRouteKey extends TMutation,
    ProcedureInput = inferProcedureInput<
      Router['_def']['mutations'][TRouteKey]
    >,
    ProcedureOutput = inferProcedureOutput<
      Router['_def']['mutations'][TRouteKey]
    >,
  >(
    path: TRouteKey,
    input: ProcedureInput
  ) => AsyncData<
    PickFrom<
      ProcedureOutput,
      KeyOfRes<_Transform<ProcedureOutput, ProcedureOutput>>
    >,
    true | Error
  >
  useClient: () => Client
}

export function createTRPCComposables(client: any) {
  const useTrpcQuery = (...args) => {
    return useAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useLazyTrpcQuery = (...args) => {
    return useLazyAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useTrpcMutation = (...args) => {
    return useAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.mutation(...args))
  }

  const useClient = () => client

  return {
    useTrpcQuery,
    useLazyTrpcQuery,
    useTrpcMutation,
    useClient,
  }
}
