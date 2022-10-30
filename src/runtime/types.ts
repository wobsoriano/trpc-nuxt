import type { TRPCClientErrorLike } from '@trpc/client'
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  ProcedureRouterRecord,
  inferProcedureInput,
  inferProcedureOutput,
} from '@trpc/server'
import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'

/**
 * @internal
 */
export type DecorateProcedure<
 TProcedure extends AnyProcedure,
 TPath extends string,
> = TProcedure extends AnyQueryProcedure
  ? {
      query: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys>,
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : TProcedure extends AnyMutationProcedure ? {
      mutate: <
      TData = inferProcedureOutput<TProcedure>,
      Transform extends _Transform<TData> = _Transform<TData, TData>,
      PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
     >(
        input: inferProcedureInput<TProcedure>,
        opts?: AsyncDataOptions<TData, Transform, PickKeys>,
      ) => AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TRPCClientErrorLike<TProcedure>>
    } : never

/**
* @internal
*/
export type DecoratedProcedureRecord<
 TProcedures extends ProcedureRouterRecord,
 TPath extends string = '',
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
       TProcedures[TKey]['_def']['record'],
       `${TPath}${TKey & string}.`
     >
    : TProcedures[TKey] extends AnyProcedure
      ? DecorateProcedure<TProcedures[TKey], `${TPath}${TKey & string}`>
      : never;
}
