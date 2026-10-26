import type { AnyTRPCRouter } from '@trpc/server';
import type { EventHandler, RequestEvent } from 'nuxt/server';
import { defineEventHandler } from 'nuxt/server';

import type { TRPCNuxtHandlerOptions } from './handle-trpc-request';
import { handleTRPCRequest } from './handle-trpc-request';

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(
  opts: TRPCNuxtHandlerOptions<TRouter, RequestEvent>,
): EventHandler<Promise<Response | undefined>> {
  return defineEventHandler((event) => handleTRPCRequest(event, event.req, opts));
}
