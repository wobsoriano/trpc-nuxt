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
>(
  client: Client
): {
  useClientQuery: <
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
  useLazyClientQuery: <
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
  useClient: () => Client
}

export function createTRPCComposables(client) {
  const useClientQuery = (...args) => {
    return useAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useLazyClientQuery = (...args) => {
    return useLazyAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useClient = () => client

  return {
    useClientQuery,
    useLazyClientQuery,
    useClient,
  }
}
