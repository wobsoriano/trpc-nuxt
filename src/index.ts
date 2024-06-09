import type { HTTPBaseHandlerOptions, ResolveHTTPRequestOptionsContextFn } from '@trpc/server/http'
import { resolveResponse } from '@trpc/server/http'
import type {
  AnyTRPCRouter,
  inferRouterContext,
} from '@trpc/server'
import type { H3Event, NodeIncomingMessage } from 'h3'
import { eventHandler, setResponseHeader, setResponseStatus } from 'h3'
import { incomingMessageToRequest } from './incomingMessageToRequest'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyTRPCRouter> = (event: H3Event) => MaybePromise<inferRouterContext<TRouter>>

function getPath (event: H3Event): string | null {
  const { params } = event.context

  if (typeof params?.trpc === 'string') { return params.trpc }

  if (params?.trpc && Array.isArray(params.trpc)) {
    return (params.trpc as string[]).join('/')
  }

  return null
}

type H3HandlerOptions<
TRouter extends AnyTRPCRouter
> = HTTPBaseHandlerOptions<TRouter, NodeIncomingMessage> & {
  createContext?: CreateContextFn<TRouter>
}

export function createNuxtApiHandler<TRouter extends AnyTRPCRouter> (opts: H3HandlerOptions<TRouter>) {
  return eventHandler(async (event) => {
    const { req } = event.node

    const createContext: ResolveHTTPRequestOptionsContextFn<TRouter> = async (
        innerOpts,
      ) => {
      return await opts.createContext?.(event);
    };

    const path = getPath(event)!

    const httpResponse = await resolveResponse({
      ...opts,
      req: incomingMessageToRequest(req, {
        maxBodySize: null,
      }),
      error: null,
      createContext,
      path,
      onError(o) {
        opts.onError?.({
          ...o,
          req
        })
      }
    })


    // if (httpResponse.status === 200) {
    //   setResponseStatus(event, status)
    // }
    setResponseStatus(event, httpResponse.status)

    for (const [key, value] of httpResponse.headers) {
      setResponseHeader(event, key, value);
    }

    return httpResponse.body
  })
}

export const createH3ApiHandler = createNuxtApiHandler
