import type { AnyTRPCRouter, inferRouterContext } from '@trpc/server';
import type {
  FetchCreateContextFn,
  FetchCreateContextFnOptions,
  FetchHandlerRequestOptions,
} from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { EventHandler, RequestEvent } from 'nuxt/server';
import { defineEventHandler } from 'nuxt/server';

import { defaultEndpoint } from '../shared';

type MaybePromise<T> = T | Promise<T>;

type CreateContextFn<TRouter extends AnyTRPCRouter> = (
  event: RequestEvent,
  fetchCreateContextOptions: FetchCreateContextFnOptions,
) => MaybePromise<inferRouterContext<TRouter>>;

type TRPCNuxtHandlerOptions<TRouter extends AnyTRPCRouter> = Omit<
  FetchHandlerRequestOptions<TRouter>,
  'endpoint' | 'req' | 'createContext'
> & {
  /**
   * The tRPC API endpoint.
   * @default '/api/trpc'
   */
  endpoint?: string;
  /**
   * A function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: CreateContextFn<TRouter>;
};

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(
  opts: TRPCNuxtHandlerOptions<TRouter>,
): EventHandler<Promise<Response | undefined>> {
  return defineEventHandler(async (event) => {
    const createContext: FetchCreateContextFn<TRouter> = async (fetchCreateContextOptions) => {
      return await opts.createContext?.(event, fetchCreateContextOptions);
    };

    const httpResponse = await fetchRequestHandler({
      ...opts,
      endpoint: opts.endpoint || defaultEndpoint,
      router: opts.router,
      req: event.req,
      createContext,
    });

    // Nitro's proxy forwards h3's handled flag, which RequestEvent does not declare.
    if (Reflect.get(event, 'handled') === true) {
      return undefined;
    }

    return httpResponse;
  });
}
