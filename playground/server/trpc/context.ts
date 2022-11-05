/* eslint-disable @typescript-eslint/no-unused-vars */
import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'

export type Context = inferAsyncReturnType<typeof createContext>

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext (
  opts: H3Event
) {
  // for API-response caching see https://trpc.io/docs/caching

  return {}
}
