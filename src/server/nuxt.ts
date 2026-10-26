import type { AnyTRPCRouter, inferRouterContext } from '@trpc/server';
import type {
  FetchCreateContextFn,
  FetchCreateContextFnOptions,
  FetchHandlerRequestOptions,
} from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { RequestEvent } from 'nuxt/server';

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
  endpoint?: string;
  createContext?: CreateContextFn<TRouter>;
};

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(
  opts: TRPCNuxtHandlerOptions<TRouter>,
): (event: RequestEvent) => Promise<Response | undefined> {
  return async (event) => {
    if (!(event.req instanceof Request)) {
      throw new Error("Default-export defineEventHandler from 'nuxt/server'.");
    }

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
  };
}
