import type {
  AnyTRPCRouter,
  inferRouterContext,
} from '@trpc/server'
import type { H3Event } from 'h3'
import { eventHandler } from 'h3'
import type { FetchCreateContextFn, FetchCreateContextFnOptions, FetchHandlerRequestOptions } from '@trpc/server/adapters/fetch'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { defaultEndpoint } from '../shared'
import { toWebRequest } from './toWebRequest'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyTRPCRouter> = (event: H3Event, fetchCreateContextOptions: FetchCreateContextFnOptions) => MaybePromise<inferRouterContext<TRouter>>

type H3HandlerOptions<
  TRouter extends AnyTRPCRouter,
> = Omit<FetchHandlerRequestOptions<TRouter>, 'endpoint' | 'req' | 'createContext'> & {
  /**
   * The tRPC API endpoint.
   * @default '/api/trpc'
   */
  endpoint?: string
  /**
   * A function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: CreateContextFn<TRouter>
}

export function createTRPCNuxtHandler<TRouter extends AnyTRPCRouter>(opts: H3HandlerOptions<TRouter>) {
  return eventHandler(async (event) => {
    const createContext: FetchCreateContextFn<TRouter> = async (
      fetchCreateContextOptions,
    ) => {
      return await opts.createContext?.(event, fetchCreateContextOptions)
    }

    const req = await toWebRequest(event)
    const httpResponse = await fetchRequestHandler({
      ...opts,
      endpoint: opts.endpoint || defaultEndpoint,
      router: opts.router,
      req,
      createContext,
    })

    return httpResponse
  })
}
