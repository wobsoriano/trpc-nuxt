import { hash } from 'ohash'
import { DecorateProcedure } from './types';
import { AnyTRPCQueryProcedure, AnyTRPCRouter, DeepPartial, inferProcedureInput } from '@trpc/server';

export type GetQueryParams<
  TProcedureOrRouter extends AnyTRPCQueryProcedure,
  TProcedureInput = inferProcedureInput<TProcedureOrRouter>,
> = DeepPartial<TProcedureInput>;

type GetParams<
  TProcedureOrRouter extends AnyTRPCQueryProcedure,
> = [
  procedureOrRouter: DecorateProcedure<TProcedureOrRouter, AnyTRPCRouter> | string,
  params: GetQueryParams<TProcedureOrRouter>,
];

type GetQueryKeyParams<
  TProcedureOrRouter extends AnyTRPCQueryProcedure,
> = GetParams<TProcedureOrRouter>;

/**
 * Method to extract the query key for a procedure
 * @param procedure - procedure
 * @param input - input to procedure
 * @link https://trpc-nuxt.vercel.app/get-started/tips/mutation
 */
export function getQueryKey<
  TProcedure extends AnyTRPCQueryProcedure,
>(..._params: GetQueryKeyParams<TProcedure>): string {
  const [procedure, input] = _params;

  if (typeof procedure === 'string') {
    // TODO: Warn here if string is passed that it will be deprecated in the future.
    return getQueryKeyInternal(procedure, input);
  }

  // @ts-expect-error: we don't expose _def on the type layer
  const path = procedure._def().path as string[];
  const dotPath = path.join('.');

  return getQueryKeyInternal(dotPath, input)
}

/**
 * @internal
 */
export function getQueryKeyInternal (
  path: string,
  input: unknown
): string {
  return input === undefined ? path : `${path}-${hash(input || '')}`
}
