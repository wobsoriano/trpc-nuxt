import type { AnyTRPCQueryProcedure, inferProcedureInput } from '@trpc/server'
import type { DeepPartial } from '@trpc/server/unstable-core-do-not-import'
import type { DecoratedMutation, DecoratedQuery, DecorateRouterRecord } from './createTRPCNuxtClient'
import { hash } from 'ohash'

type ProcedureOrRouter =
  | DecoratedMutation<any>
  | DecoratedQuery<any>
  | DecorateRouterRecord<any, any>

export type GetQueryParams<
  TProcedureOrRouter extends AnyTRPCQueryProcedure,
  TProcedureInput = inferProcedureInput<TProcedureOrRouter>,
> = DeepPartial<TProcedureInput>

/** @internal */
export type GetQueryProcedureInput<TProcedureInput> = DeepPartial<TProcedureInput> | undefined

type GetParams<TProcedureOrRouter extends ProcedureOrRouter> =
  TProcedureOrRouter extends DecoratedQuery<infer $Def>
    ? [input?: GetQueryProcedureInput<$Def['input']>]
    : []

/**
 * Method to extract the query key for a procedure
 * @param procedure - procedure
 * @param input - input to procedure
 * @link https://trpc-nuxt.vercel.app/get-started/tips/mutation
 */
export function getQueryKey<TProcedureOrRouter extends ProcedureOrRouter,
>(
  procedureOrRouter: TProcedureOrRouter,
  ..._params: GetParams<TProcedureOrRouter>
): string {
  const [input] = _params

  // @ts-expect-error - we don't expose _def on the type layer
  const path = procedureOrRouter._def().path as string[]
  const dotPath = path.join('.')

  return getQueryKeyInternal(dotPath, input)
}

/**
 * @internal
 */
export function getQueryKeyInternal(
  path: string,
  input: unknown,
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}
