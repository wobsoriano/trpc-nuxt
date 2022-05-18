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
import type { CompatibilityEvent } from 'h3'
import { defineEventHandler, isMethod, useBody } from 'h3'
import type { TRPCResponse } from '@trpc/server/dist/declarations/src/rpc'

type MaybePromise<T> = T | Promise<T>

type CreateContextFn<TRouter extends AnyRouter> = (event: CompatibilityEvent) => MaybePromise<inferRouterContext<TRouter>>

type ResponseMetaFn<TRouter extends AnyRouter> = (opts: {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[]
  ctx?: inferRouterContext<TRouter>
  paths?: string[]
  type: ProcedureType | 'unknown'
  errors: TRPCError[]
}) => ResponseMeta

export function createTRPCHandler<Router extends AnyRouter>({
  router,
  createContext,
  responseMeta,
}: {
  router: Router
  createContext?: CreateContextFn<Router>
  responseMeta?: ResponseMetaFn<Router>
}) {
  const url = '/trpc'

  return defineEventHandler(async (event) => {
    const {
      req,
      res,
    } = event

    const $url = createURL(req.url)

    const httpResponse = await resolveHTTPResponse({
      router,
      req: {
        method: req.method,
        headers: req.headers,
        body: isMethod(event, 'GET') ? null : await useBody(event),
        query: $url.searchParams,
      },
      path: $url.pathname.substring(url.length + 1),
      createContext: async () => createContext?.(event),
      responseMeta,
    })

    const { status, headers, body } = httpResponse

    res.statusCode = status

    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key])
    })

    return body
  })
}
