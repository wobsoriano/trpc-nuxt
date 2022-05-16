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
import type { IncomingMessage } from 'h3'
import type { TRPCResponse } from '@trpc/server/dist/declarations/src/rpc'
import { isMethod, useBody } from 'h3'

type MaybePromise<T> = T | Promise<T>

type CreateContextFn<TRouter extends AnyRouter> = (req: IncomingMessage) => MaybePromise<inferRouterContext<TRouter>>

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

  return async (event) => {
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
      path: $url.pathname.substring(url.length + 5),
      createContext: async () => createContext?.(req),
      responseMeta,
    })

    const { status, headers, body } = httpResponse

    res.statusCode = status

    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key])
    })

    return body
  }
}
