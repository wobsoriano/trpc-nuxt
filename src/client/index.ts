import { createTRPCProxyClient, type CreateTRPCClientOptions } from '@trpc/client'
import { createFlatProxy, type AnyRouter } from '@trpc/core'
import { type DecoratedProcedureRecord } from './types'
import { getQueryKey } from './getQueryKey'
import { createNuxtProxyDecoration } from './decorationProxy'

export { getQueryKey }

export function createTRPCNuxtClient<TRouter extends AnyRouter> (opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCProxyClient<TRouter>(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client as any)
  }) as DecoratedProcedureRecord<TRouter['_def']['record'], TRouter>

  return decoratedClient
}

export {
  httpBatchLink,
  httpLink
} from './links'
