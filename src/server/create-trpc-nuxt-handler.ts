import { eventHandler } from '#imports';
import type { AnyTRPCRouter } from '@trpc/server';
import type { H3Event } from 'h3';

import type { TRPCNuxtHandlerOptions } from './handle-trpc-request';
import { handleTRPCRequest } from './handle-trpc-request';
import { toWebRequest } from './utils';

/**
 * Creates a tRPC handler for a Nuxt server route. Its `createContext` receives h3's `H3Event`.
 *
 * On Nuxt 4.6 or later, import from `trpc-nuxt/server/future` instead. That handler passes
 * Nuxt's `RequestEvent` from `nuxt/server` to `createContext`. The next major release moves
 * it to `trpc-nuxt/server`.
 *
 * @see https://trpc-nuxt.pages.dev/references/createtrpcnuxthandler/
 */
export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(
  opts: TRPCNuxtHandlerOptions<TRouter, H3Event>,
) {
  return eventHandler((event) => handleTRPCRequest(event, toWebRequest(event), opts));
}
