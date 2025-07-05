import type {
  AnyTRPCRouter,
  inferRouterContext,
} from '@trpc/server';
import type { FetchCreateContextFn, FetchCreateContextFnOptions, FetchHandlerRequestOptions } from '@trpc/server/adapters/fetch';
import type { H3Event } from 'h3';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { eventHandler } from 'h3';
import { defaultEndpoint } from '../shared';
import { toWebRequest } from './toWebRequest';

type MaybePromise<T> = T | Promise<T>;

type CreateContextFn<TRouter extends AnyTRPCRouter> = (event: H3Event, fetchCreateContextOptions: FetchCreateContextFnOptions) => MaybePromise<inferRouterContext<TRouter>>;

type TRPCNuxtHandlerOptions<
  TRouter extends AnyTRPCRouter,
> = Omit<FetchHandlerRequestOptions<TRouter>, 'endpoint' | 'req' | 'createContext'> & {
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

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(opts: TRPCNuxtHandlerOptions<TRouter>) {
  return eventHandler(async (event) => {
    const createContext: FetchCreateContextFn<TRouter> = async (
      fetchCreateContextOptions,
    ) => {
      return await opts.createContext?.(event, fetchCreateContextOptions);
    };

    const httpResponse = await fetchRequestHandler({
      ...opts,
      endpoint: opts.endpoint || defaultEndpoint,
      router: opts.router,
      req: toWebRequest(event),
      createContext,
    });

    // don't return tRPC response when h3 event was already handled (e.g. using sendRedirect() or sendStream())
    if (event.handled)
      return;

    return httpResponse;
  });
}
