import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import type {
  ProcedureRecord,
  inferHandlerInput,
  inferProcedureInput,
  inferProcedureOutput,
} from '@trpc/server'
import type { TRPCClient, TRPCClientErrorLike } from '@trpc/client'
import { objectHash } from 'ohash'
import type { Ref } from 'vue'
import { useAsyncData, useNuxtApp, useState } from '#app'
import type { AppRouter } from '~/server/trpc'

type MaybeRef<T> = T | Ref<T>

export type inferProcedures<
  TObj extends ProcedureRecord,
> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>
    output: inferProcedureOutput<TObj[TPath]>
  };
}

export type TQueries = AppRouter['_def']['procedures']
export type TError = TRPCClientErrorLike<AppRouter>

export type TQueryValues = inferProcedures<AppRouter['_def']['procedures']>

/**
 * Calculates the key used for `useAsyncData` call
 * @param pathAndInput
 */
export function getQueryKey<
    TPath extends keyof TQueryValues & string,
    >(pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>]) {
  return `${pathAndInput[0]}-${objectHash(pathAndInput[1] ? JSON.stringify(pathAndInput[1]) : '')}`
}

export async function useAsyncQuery<
  TPath extends keyof TQueryValues & string,
  TOutput extends TQueryValues[TPath]['output'] = TQueryValues[TPath]['output'],
  Transform extends _Transform<TOutput> = _Transform<TOutput, TOutput>,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
>(
  pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
  options: AsyncDataOptions<TOutput, Transform, PickKeys> = {},
): Promise<AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, TError>> {
  const { $client } = useNuxtApp()
  const key = getQueryKey(pathAndInput)
  const serverError = useState<TError | null>(`error-${key}`, () => null)
  const { error, data, ...rest } = await useAsyncData(
    key,
    () => $client.query(...pathAndInput),
    options,
  )

  if (error.value && !serverError.value)
    serverError.value = error.value as any

  if (data.value)
    serverError.value = null

  return {
    ...rest,
    data,
    error: serverError,
  } as any
}

export function useClient(): TRPCClient<AppRouter> {
  const { $client } = useNuxtApp()
  return $client
}

export function useClientHeaders(initialValue: MaybeRef<Record<string, any>> = {}): Ref<Record<string, any>> {
  return useState('trpc-nuxt-header', () => initialValue)
}
