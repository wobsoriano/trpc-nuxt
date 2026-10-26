import type { AnyTRPCRouter, inferRouterContext } from '@trpc/server';
import type {
  FetchCreateContextFn,
  FetchCreateContextFnOptions,
  FetchHandlerRequestOptions,
} from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { defaultEndpoint } from '../shared';

type MaybePromise<T> = T | Promise<T>;

export type TRPCNuxtHandlerOptions<TRouter extends AnyTRPCRouter, TEvent> = Omit<
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
  createContext?: (
    event: TEvent,
    fetchCreateContextOptions: FetchCreateContextFnOptions,
  ) => MaybePromise<inferRouterContext<TRouter>>;
};

export async function handleTRPCRequest<TRouter extends AnyTRPCRouter, TEvent extends object>(
  event: TEvent,
  req: Request,
  opts: TRPCNuxtHandlerOptions<TRouter, TEvent>,
): Promise<Response | undefined> {
  const createContext: FetchCreateContextFn<TRouter> = async (fetchCreateContextOptions) => {
    return await opts.createContext?.(event, fetchCreateContextOptions);
  };

  const httpResponse = await fetchRequestHandler({
    ...opts,
    endpoint: opts.endpoint || defaultEndpoint,
    router: opts.router,
    req,
    createContext,
  });

  // Skip the tRPC response when the event was already handled (e.g. sendRedirect() or sendStream()).
  // On Nuxt 4.6 the portable event forwards h3's flag, which RequestEvent does not declare.
  if (Reflect.get(event, 'handled') === true) {
    return undefined;
  }

  return httpResponse;
}
