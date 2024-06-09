import { TRPCUntypedClient, createTRPCClientProxy } from '@trpc/client'
import { type DecoratedProcedureRecord } from './types'
import { getQueryKey } from './getQueryKey'
import { createNuxtProxyDecoration } from './decorationProxy'
import { AnyTRPCRouter, createTRPCFlatProxy } from '@trpc/server'

export { getQueryKey }

export function createTRPCNuxtClient<TRouter extends AnyTRPCRouter> (opts: TRPCUntypedClient<TRouter>) {
  const client = createTRPCClientProxy<TRouter>(opts)

  const decoratedClient = createTRPCFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client as any)
  }) as DecoratedProcedureRecord<TRouter['_def']['record'], TRouter>

  return decoratedClient
}

export {
  httpBatchLink,
  httpLink
} from './links'
