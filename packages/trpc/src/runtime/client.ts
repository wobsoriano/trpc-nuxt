import { objectHash } from 'ohash'
import type { TRPCClient } from '@trpc/client'
import { useAsyncData, useLazyAsyncData } from '#imports'

// type ReturnType<T> = T extends (...args: any) => infer R ? R : never

export function createTRPCComposables<T extends TRPCClient<any>>(client: T): {
  useTrpcQuery: (...args: Parameters<typeof client['query']>) => ReturnType<typeof useAsyncData>
  useTrpcLazyQuery: (...args: Parameters<typeof client['query']>) => ReturnType<typeof useLazyAsyncData>
  useTrpcMutation: (...args: Parameters<typeof client['mutation']>) => ReturnType<typeof useAsyncData>
}

export function createTRPCComposables<
  T extends TRPCClient<any>,
>(client: T) {
  const useTrpcQuery = (...args: Parameters<typeof client.query>) => {
    return useAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useTrpcLazyQuery = (...args: Parameters<typeof client.query>) => {
    return useLazyAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.query(...args))
  }

  const useTrpcMutation = (...args: Parameters<typeof client.mutation>) => {
    return useAsyncData(`trpc-${objectHash(args[0] + (args[1] ? JSON.stringify(args[1]) : ''))}`, () => client.mutation(...args))
  }

  return {
    useTrpcQuery,
    useTrpcLazyQuery,
    useTrpcMutation,
  }
}
