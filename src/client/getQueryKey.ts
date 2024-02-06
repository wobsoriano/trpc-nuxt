import { hash } from 'ohash';
import type { DecorateProcedure, DecorateRouterRecord } from './types';
import type {
  inferProcedureInput,
  AnyMutationProcedure,
  AnyRootTypes,
  AnyRouter,
  DeepPartial,
  AnyQueryProcedure
} from '@trpc/server/unstable-core-do-not-import';

/** @internal */
export type GetQueryProcedureInput<TProcedureInput> = DeepPartial<TProcedureInput> | undefined

export type QueryType = 'any' | 'infinite' | 'query';

type GetQueryParams<
  TProcedureOrRouter extends AnyQueryProcedure,
  TProcedureInput = inferProcedureInput<TProcedureOrRouter>,
> = TProcedureInput extends undefined
  ? []
  : [input?: GetQueryProcedureInput<TProcedureInput>, type?: QueryType];

type GetParams<
  TRoot extends AnyRootTypes,
  TProcedureOrRouter extends
    | AnyMutationProcedure
    | AnyQueryProcedure
    | AnyRouter,
> = TProcedureOrRouter extends AnyQueryProcedure
  ? [
      procedureOrRouter: DecorateProcedure<TRoot, TProcedureOrRouter>,
      ..._params: GetQueryParams<TProcedureOrRouter>,
    ]
  : TProcedureOrRouter extends AnyMutationProcedure
  ? [procedureOrRouter: DecorateProcedure<TRoot, TProcedureOrRouter>]
  : TProcedureOrRouter extends AnyRouter
  ? [
      procedureOrRouter: DecorateRouterRecord<
        TRoot,
        TProcedureOrRouter['_def']['record']
      >,
    ]
  : never;

type GetQueryKeyParams<
  TRoot extends AnyRootTypes,
  TProcedureOrRouter extends
    | AnyMutationProcedure
    | AnyQueryProcedure
    | AnyRouter,
> = GetParams<TRoot, TProcedureOrRouter>;

/**
 * Method to extract the query key for a procedure
 * @param procedure - procedure
 * @param input - input to procedure
 * @link https://trpc-nuxt.vercel.app/get-started/tips/mutation
 */
export function getQueryKey<
  TRoot extends AnyRootTypes,
  TProcedureOrRouter extends
    | AnyMutationProcedure
    | AnyQueryProcedure
    | AnyRouter,
>(..._params: GetQueryKeyParams<TRoot, TProcedureOrRouter>): string {
  const [procedure, input] = _params;

  if (typeof procedure === 'string') {
    // TODO: Warn here if string is passed that it will be deprecated in the future.
    return getQueryKeyInternal(procedure, input);
  }
  
  // @ts-expect-error: TODO
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
