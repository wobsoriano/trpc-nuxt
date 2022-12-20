import { resolveHTTPResponse } from '@trpc/server'
import type {
  AnyRouter,
  ProcedureType,
  ResponseMeta,
  TRPCError,
  inferRouterContext,
  inferRouterError,
} from '@trpc/server'
import { createURL } from 'ufo'
import type { H3Event } from 'h3'
import { defineEventHandler, isMethod, readBody } from 'h3'
import type { TRPCResponse } from '@trpc/server/dist/declarations/src/rpc'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyRouter> = (event: H3Event) => MaybePromise<inferRouterContext<TRouter>>

export interface ResponseMetaFnPayload<TRouter extends AnyRouter> {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[]
  ctx?: inferRouterContext<TRouter>
  paths?: string[]
  type: ProcedureType | 'unknown'
  errors: TRPCError[]
}

export type ResponseMetaFn<TRouter extends AnyRouter> = (opts: ResponseMetaFnPayload<TRouter>) => ResponseMeta

export interface OnErrorPayload<TRouter extends AnyRouter> {
  error: TRPCError
  type: ProcedureType | 'unknown'
  path: string | undefined
  req: H3Event['node']['req']
  input: unknown
  ctx: undefined | inferRouterContext<TRouter>
}

export type OnErrorFn<TRouter extends AnyRouter> = (opts: OnErrorPayload<TRouter>) => void

export function createTRPCHandler<Router extends AnyRouter>({
  router,
  createContext,
  responseMeta,
  onError,
  endpoint,
}: {
  router: Router
  createContext?: CreateContextFn<Router>
  responseMeta?: ResponseMetaFn<Router>
  onError?: OnErrorFn<Router>
  endpoint: string
}) {
  return defineEventHandler(async (event) => {
    const {
      req,
      res,
    } = event.node

    const $url = createURL(req.url!)

    const httpResponse = await resolveHTTPResponse({
      router,
      req: {
        method: req.method!,
        headers: req.headers,
        body: isMethod(event, 'GET') ? null : await readBody(event),
        query: $url.searchParams,
      },
      path: $url.pathname.substring(endpoint.length + 1),
      createContext: async () => createContext?.(event),
      responseMeta,
      onError: (o) => {
        onError?.({
          ...o,
          req,
        })
      },
    })

    const { status, headers, body } = httpResponse

    res.statusCode = status

    headers && Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]!)
    })

    return body
  })
}
