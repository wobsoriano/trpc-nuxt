import type {
  TRPCClientErrorLike,
  TRPCRequestOptions as _TRPCRequestOptions,
} from "@trpc/client";
import { type TRPCSubscriptionObserver } from "@trpc/client/dist/internals/TRPCUntypedClient";
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureArgs,
  AnySubscriptionProcedure,
} from "@trpc/server";
import {
  type inferObservableValue,
  type Unsubscribable,
} from "@trpc/server/observable";
import { inferTransformedProcedureOutput } from "@trpc/server/shared";

import type {
  //   DefinedUseQueryResult,
  //   DehydratedState,
  //   InfiniteQueryObserverSuccessResult,
  InitialDataFunction,
  //   QueryObserverSuccessResult,
  //   QueryOptions,
  //   UseInfiniteQueryOptions,
  //   UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationReturnType,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
  //   UseQueryResult,
} from "@tanstack/vue-query";

interface TRPCRequestOptions extends _TRPCRequestOptions {
  abortOnUnmount?: boolean;
}

type Resolver<TProcedure extends AnyProcedure> = (
  ...args: ProcedureArgs<TProcedure["_def"]>
) => Promise<inferTransformedProcedureOutput<TProcedure>>;

type SubscriptionResolver<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter
> = (
  ...args: [
    input: ProcedureArgs<TProcedure["_def"]>[0],
    opts: ProcedureArgs<TProcedure["_def"]>[1] &
      Partial<
        TRPCSubscriptionObserver<
          inferObservableValue<inferProcedureOutput<TProcedure>>,
          TRPCClientErrorLike<TRouter>
        >
      >
  ]
) => Unsubscribable;

export type DecorateProcedure<
  TProcedure extends AnyProcedure,
  TRouter extends AnyRouter,
  TPath extends string,
> = TProcedure extends AnyQueryProcedure
  ? {
      useQuery: ProcedureUseQuery<TProcedure, TPath>;
      query: Resolver<TProcedure>;
    }
  : TProcedure extends AnyMutationProcedure
  ? {
      useMutation: <TContext = unknown>(
        opts?: UseTRPCMutationOptions<
          inferProcedureInput<TProcedure>,
          TRPCClientErrorLike<TProcedure>,
          inferTransformedProcedureOutput<TProcedure>,
          TContext
        >,
      ) => UseTRPCMutationResult<
        inferTransformedProcedureOutput<TProcedure>,
        TRPCClientErrorLike<TProcedure>,
        inferProcedureInput<TProcedure>,
        TContext
      >;
      mutate: Resolver<TProcedure>;
    }
  : TProcedure extends AnySubscriptionProcedure
  ? {
      subscribe: SubscriptionResolver<TProcedure, TRouter>;
    }
  : never;

/**
 * @internal
 */
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TRouter extends AnyRouter,
  TPath extends string = ''
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"], TRouter>
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey], TRouter, `${TPath}${TKey & string}`>
    : never;
};

export interface ProcedureUseQuery<
  TProcedure extends AnyProcedure,
  TPath extends string
> {
  <
    TQueryFnData = inferTransformedProcedureOutput<TProcedure>,
    TData = inferTransformedProcedureOutput<TProcedure>
  >(
    input: inferProcedureInput<TProcedure>,
    opts: DefinedUseTRPCQueryOptions<
      TPath,
      inferProcedureInput<TProcedure>,
      TQueryFnData,
      TData,
      TRPCClientErrorLike<TProcedure>
    >
  ): DefinedUseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>;

  <
    TQueryFnData = inferTransformedProcedureOutput<TProcedure>,
    TData = inferTransformedProcedureOutput<TProcedure>
  >(
    input: inferProcedureInput<TProcedure>,
    opts?: UseTRPCQueryOptions<
      TPath,
      inferProcedureInput<TProcedure>,
      TQueryFnData,
      TData,
      TRPCClientErrorLike<TProcedure>
    >
  ): UseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>;
}

export interface DefinedUseTRPCQueryOptions<
  TPath,
  TInput,
  TOutput,
  TData,
  TError
> extends UseTRPCQueryOptions<TPath, TInput, TOutput, TData, TError> {
  initialData: TOutput | InitialDataFunction<TOutput>;
}

export type DefinedUseTRPCQueryResult<TData, TError> = UseQueryDefinedReturnType<
  TData,
  TError
> &
  TRPCHookResult;

export interface UseTRPCQueryOptions<TPath, TInput, TOutput, TData, TError>
  extends UseQueryOptions<TOutput, TError, TData, [TPath, TInput]>,
    TRPCUseQueryBaseOptions {}

export type UseTRPCQueryResult<TData, TError> = UseQueryReturnType<TData, TError> &
  TRPCHookResult;

export interface DefinedUseTRPCQueryOptions<
  TPath,
  TInput,
  TOutput,
  TData,
  TError
> extends UseTRPCQueryOptions<TPath, TInput, TOutput, TData, TError> {
  initialData: TOutput | InitialDataFunction<TOutput>;
}

export interface TRPCHookResult {
  trpc: {
    path: string;
  };
}

export interface TRPCUseQueryBaseOptions {
  /**
   * tRPC-related options
   */
  trpc?: TRPCReactRequestOptions;
}

export interface TRPCReactRequestOptions
  // For RQ, we use their internal AbortSignals instead of letting the user pass their own
  extends Omit<TRPCRequestOptions, "signal"> {
  /**
   * Opt out of SSR for this query by passing `ssr: false`
   */
  ssr?: boolean;
  /**
   * Opt out or into aborting request on unmount
   */
  abortOnUnmount?: boolean;
}


export interface UseTRPCMutationOptions<
  TInput,
  TError,
  TOutput,
  TContext = unknown,
> extends UseMutationOptions<TOutput, TError, TInput, TContext>,
    TRPCUseQueryBaseOptions {}

    export type UseTRPCMutationResult<TData, TError, TVariables, TContext> =
    UseMutationReturnType<TData, TError, TVariables, TContext> & TRPCHookResult;
  