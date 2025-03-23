import type { AnyTRPCQueryProcedure, inferProcedureInput } from '@trpc/server';
import type { DeepPartial } from '@trpc/server/unstable-core-do-not-import';
import type { DecoratedMutation, DecoratedQuery, DecorateRouterRecord } from './createTRPCNuxtClient';
import { hash } from 'ohash';

type ProcedureOrRouter =
  | DecoratedMutation<any>
  | DecoratedQuery<any>
  | DecorateRouterRecord<any, any>;

export type GetQueryParams<
  TProcedureOrRouter extends AnyTRPCQueryProcedure,
  TProcedureInput = inferProcedureInput<TProcedureOrRouter>,
> = DeepPartial<TProcedureInput>;

/** @internal */
export type GetQueryProcedureInput<TProcedureInput> = DeepPartial<TProcedureInput> | undefined;

type GetParams<TProcedureOrRouter extends ProcedureOrRouter> =
  TProcedureOrRouter extends DecoratedQuery<infer $Def>
    ? [input?: GetQueryProcedureInput<$Def['input']>]
    : [];

export function getQueryKeyInternal(
  path: string,
  input: unknown,
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`;
}

/**
 * Method to extract the query key for a procedure
 * @param procedure - procedure
 * @param input - input to procedure
 * @see https://trpc-nuxt.vercel.app/references/getquerykey
 */
export function getQueryKey<TProcedureOrRouter extends ProcedureOrRouter,
>(
  procedureOrRouter: TProcedureOrRouter,
  ..._params: GetParams<TProcedureOrRouter>
): string {
  const [input] = _params;

  // @ts-expect-error - we don't expose _def on the type layer
  const path = procedureOrRouter._def().path as string[];
  const dotPath = path.join('.');

  return getQueryKeyInternal(dotPath, input);
}

export function getMutationKeyInternal(path: string) {
  return getQueryKeyInternal(path, undefined);
}

/**
 * Method to extract the mutation key for a procedure
 * @param procedure - procedure
 * @see https://trpc-nuxt.vercel.app/references/getquerykey
 */
export function getMutationKey<TProcedure extends DecoratedMutation<any>>(procedure: TProcedure) {
  // @ts-expect-error - we don't expose _def on the type layer
  const path = procedure._def().path as string[];
  const dotPath = path.join('.');

  return getMutationKeyInternal(dotPath);
}
