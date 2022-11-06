import type { ResponseMeta } from '@trpc/server/http'
import { resolveHTTPResponse } from '@trpc/server/http'
import type {
  AnyRouter,
  ProcedureType,
  inferRouterContext,
  inferRouterError
} from '@trpc/server'
import {
  TRPCError
} from '@trpc/server'
import { createURL } from 'ufo'
import type { H3Event } from 'h3'
import { createError, defineEventHandler, isMethod, readBody } from 'h3'
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

export interface ResolveHTTPRequestOptions<TRouter extends AnyRouter> {
  router: TRouter
  createContext?: CreateContextFn<TRouter>
  responseMeta?: ResponseMetaFn<TRouter>
  onError?: OnErrorFn<TRouter>
  batching?: {
    enabled: boolean
  }
}

function getPath (event: H3Event): string | null {
  if (typeof event.context.params.trpc === 'string') { return event.context.params.trpc }

  if (Array.isArray(event.context.params.trpc)) { return event.context.params.trpc.join('/') }

  return null
}

export function createNuxtApiHandler<TRouter extends AnyRouter> ({
  router,
  createContext,
  responseMeta,
  onError,
  batching
}: ResolveHTTPRequestOptions<TRouter>) {
  return defineEventHandler(async (event) => {
    const {
      req,
      res
    } = event

    const $url = createURL(req.url!)

    const path = getPath(event)

    if (path === null) {
      const error = router.getErrorShape({
        error: new TRPCError({
          message:
            'Param "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
          code: 'INTERNAL_SERVER_ERROR'
        }),
        type: 'unknown',
        ctx: undefined,
        path: undefined,
        input: undefined
      })

      throw createError({
        statusCode: 500,
        statusMessage: JSON.stringify(error)
      })
    }

    const httpResponse = await resolveHTTPResponse({
      batching,
      router,
      req: {
        method: req.method!,
        headers: req.headers,
        body: isMethod(event, 'GET') ? null : await readBody(event),
        query: $url.searchParams
      },
      path,
      createContext: async () => await createContext?.(event),
      responseMeta,
      onError: (o) => {
        onError?.({
          ...o,
          req
        })
      }
    })

    const { status, headers, body } = httpResponse

    res.statusCode = status

    headers && Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]!)
    })

    return body
  })
}
