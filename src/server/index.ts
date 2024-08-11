import type { HTTPBaseHandlerOptions, ResolveHTTPRequestOptionsContextFn } from '@trpc/server/http'
import { resolveResponse } from '@trpc/server/http'
import type {
  AnyTRPCRouter,
  inferRouterContext,
} from '@trpc/server'
import type { H3Event, NodeIncomingMessage } from 'h3'
import { eventHandler, readBody, toWebRequest } from 'h3'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyTRPCRouter> = (event: H3Event) => MaybePromise<inferRouterContext<TRouter>>

function getPath(event: H3Event): string | null {
  const { params } = event.context

  if (typeof params?.trpc === 'string') {
    return params.trpc
  }

  if (params?.trpc && Array.isArray(params.trpc)) {
    return (params.trpc as string[]).join('/')
  }

  return null
}

type H3HandlerOptions<
  TRouter extends AnyTRPCRouter,
> = HTTPBaseHandlerOptions<TRouter, NodeIncomingMessage> & {
  createContext?: CreateContextFn<TRouter>
}

export function createNuxtApiHandler<TRouter extends AnyTRPCRouter>(opts: H3HandlerOptions<TRouter>) {
  return eventHandler(async (event) => {
    const createContext: ResolveHTTPRequestOptionsContextFn<TRouter> = async (
      // TODO: Add this inner options to context
      innerOpts,
    ) => {
      return await opts.createContext?.(event)
    }

    const { req } = event.node

    const path = getPath(event)!

    // monkey-patch body to the IncomingMessage
    if (event.method === 'POST') {
      (req as any).body = await readBody(event)
    }

    const httpResponse = await resolveResponse({
      ...opts,
      req: toWebRequest(event),
      error: null,
      createContext,
      path,
      onError(o) {
        opts.onError?.({
          ...o,
          req,
        })
      },
    })

    return httpResponse
  })
}

export const createH3ApiHandler = createNuxtApiHandler
