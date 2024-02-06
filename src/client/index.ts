import { createTRPCClient, type CreateTRPCClientOptions } from '@trpc/client'
import { createFlatProxy, type AnyRouter, inferRootTypes } from '@trpc/server/unstable-core-do-not-import'
import { type DecorateRouterRecord } from './types'
import { getQueryKey } from './getQueryKey'
import { createNuxtProxyDecoration } from './decorationProxy'

export { getQueryKey }

export function createTRPCNuxtClient<TRouter extends AnyRouter> (opts: CreateTRPCClientOptions<TRouter>) {
  const client = createTRPCClient<TRouter>(opts)

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client as any)
  }) as DecorateRouterRecord<
    inferRootTypes<TRouter>,
    TRouter['_def']['record']
  >

  return decoratedClient
}

export {
  httpBatchLink,
  httpLink
} from './links'
