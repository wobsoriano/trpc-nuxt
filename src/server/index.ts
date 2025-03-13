import type {
  AnyTRPCRouter,
  inferRouterContext,
} from '@trpc/server'
import type { H3Event } from 'h3'
import { eventHandler, toWebRequest } from 'h3'
import type { FetchCreateContextFn, FetchCreateContextFnOptions, FetchHandlerRequestOptions } from '@trpc/server/adapters/fetch'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { defaultEndpoint } from '../utils'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyTRPCRouter> = (event: H3Event, innerOptions: FetchCreateContextFnOptions) => MaybePromise<inferRouterContext<TRouter>>

type H3HandlerOptions<
  TRouter extends AnyTRPCRouter,
> = Omit<FetchHandlerRequestOptions<TRouter>, 'endpoint' | 'req' | 'createContext'> & {
  endpoint?: string
  createContext?: CreateContextFn<TRouter>
}

export function createNuxtApiHandler<TRouter extends AnyTRPCRouter>(opts: H3HandlerOptions<TRouter>) {
  return eventHandler(async (event) => {
    const createContext: FetchCreateContextFn<TRouter> = async (
      innerOpts,
    ) => {
      return await opts.createContext?.(event, innerOpts)
    }

    const httpResponse = await fetchRequestHandler({
      ...opts,
      endpoint: opts.endpoint || defaultEndpoint,
      router: opts.router,
      req: toWebRequest(event),
      createContext,
    })

    return httpResponse
  })
}

export const createH3ApiHandler = createNuxtApiHandler
