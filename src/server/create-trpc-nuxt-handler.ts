import { eventHandler } from '#imports';
import type { AnyTRPCRouter } from '@trpc/server';
import type { H3Event } from 'h3';

import type { TRPCNuxtHandlerOptions } from './handle-trpc-request';
import { handleTRPCRequest } from './handle-trpc-request';
import { toWebRequest } from './utils';

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(
  opts: TRPCNuxtHandlerOptions<TRouter, H3Event>,
) {
  return eventHandler((event) => handleTRPCRequest(event, toWebRequest(event), opts));
}
