import {
  AnyQueryProcedure,
  AnyRouter,
  DeepPartial,
  inferProcedureInput,
} from '@trpc/core';
import { hash } from 'ohash'
import { DecorateProcedure } from './types';

export type GetQueryParams<
  TProcedureOrRouter extends AnyQueryProcedure,
  TProcedureInput = inferProcedureInput<TProcedureOrRouter>,
> = DeepPartial<TProcedureInput>;

type GetParams<
  TProcedureOrRouter extends AnyQueryProcedure,
> = [
  procedureOrRouter: DecorateProcedure<TProcedureOrRouter, AnyRouter> | string,
  params: GetQueryParams<TProcedureOrRouter>,
];

type GetQueryKeyParams<
  TProcedureOrRouter extends AnyQueryProcedure,
> = GetParams<TProcedureOrRouter>;

/**
 * Method to extract the query key for a procedure
 * @param procedure - procedure
 * @param input - input to procedure
 * @link https://trpc-nuxt.vercel.app/get-started/tips/mutation
 */
export function getQueryKey<
  TProcedure extends AnyQueryProcedure,
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
