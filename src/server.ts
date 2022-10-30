import type { ResponseMeta } from '@trpc/server/http'
import { resolveHTTPResponse } from '@trpc/server/http'
import type {
  AnyRouter,
  ProcedureType,
  TRPCError,
  inferRouterContext,
  inferRouterError,
} from '@trpc/server'
import { createURL } from 'ufo'
import type { H3Event } from 'h3'
import { defineEventHandler, isMethod, readBody } from 'h3'
import type { TRPCResponse } from '@trpc/server/rpc'

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
  req: H3Event['req']
  input: unknown
  ctx: undefined | inferRouterContext<TRouter>
}

export type OnErrorFn<TRouter extends AnyRouter> = (opts: OnErrorPayload<TRouter>) => void

export function createNuxtApiHandler<TRouter extends AnyRouter>({
  router,
  createContext,
  responseMeta,
  onError,
  url = '/api/trpc',
}: {
  router: TRouter
  createContext?: CreateContextFn<TRouter>
  responseMeta?: ResponseMetaFn<TRouter>
  onError?: OnErrorFn<TRouter>
  url?: string
}) {
  return defineEventHandler(async (event) => {
    const {
      req,
      res,
    } = event

    const $url = createURL(req.url!)

    const httpResponse = await resolveHTTPResponse({
      router,
      req: {
        method: req.method!,
        headers: req.headers,
        body: isMethod(event, 'GET') ? null : await readBody(event),
        query: $url.searchParams,
      },
      path: $url.pathname.substring(url.length + 1),
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
