/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { H3Event } from 'h3'

export type Context = Awaited<ReturnType<typeof createContext>>

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext(
  event: H3Event,
  _innerOptions?: FetchCreateContextFnOptions,
) {
  // for API-response caching see https://trpc.io/docs/caching
  // console.log('cookies', parseCookies(event))

  return {
    userId: 1,
  }
}
