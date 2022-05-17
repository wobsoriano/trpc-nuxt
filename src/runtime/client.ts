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
  useTrpcQuery: <TRouteKey extends TQuery>(
    args_0: TRouteKey,
    args_1: inferProcedureInput<Router['_def']['queries'][TRouteKey]>
  ) => AsyncData<
    PickFrom<
      inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
      KeyOfRes<
        _Transform<
          inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
          inferProcedureOutput<Router['_def']['queries'][TRouteKey]>
        >
      >
    >,
    true | Error
  >
  useLazyTrpcQuery: <TRouteKey extends TQuery>(
    args_0: TRouteKey,
    args_1: inferProcedureInput<Router['_def']['queries'][TRouteKey]>
  ) => AsyncData<
    PickFrom<
      inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
      KeyOfRes<
        _Transform<
          inferProcedureOutput<Router['_def']['queries'][TRouteKey]>,
          inferProcedureOutput<Router['_def']['queries'][TRouteKey]>
        >
      >
    >,
    true | Error
  >
  useTrpcMutation: <TRouteKey extends TMutation>(
    args_0: TRouteKey,
    args_1: inferProcedureInput<Router['_def']['mutations'][TRouteKey]>
  ) => AsyncData<
    PickFrom<
      inferProcedureOutput<Router['_def']['mutations'][TRouteKey]>,
      KeyOfRes<
        _Transform<
          inferProcedureOutput<Router['_def']['mutations'][TRouteKey]>,
          inferProcedureOutput<Router['_def']['mutations'][TRouteKey]>
        >
      >
    >,
    true | Error
  >
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

  return {
    useTrpcQuery,
    useLazyTrpcQuery,
    useTrpcMutation,
  }
}
