import type {
  AsyncData,
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import type { ProcedureRecord, inferHandlerInput, inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { TRPCClient, TRPCClientErrorLike } from '@trpc/client'
import { objectHash } from 'ohash'
import type { MaybeRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useAsyncData, useNuxtApp, useState } from '#app'
import type { router } from '~/server/trpc'

type AppRouter = typeof router

export type inferProcedures<
  TObj extends ProcedureRecord<any, any, any, any, any, any>,
> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>
    output: inferProcedureOutput<TObj[TPath]>
  };
}

export type TQueries = AppRouter['_def']['queries']
export type TError = TRPCClientErrorLike<AppRouter>

export type TQueryValues = inferProcedures<AppRouter['_def']['queries']>

/**
 * Additional header properties to pass to tRPC client.
 *
 * @see https://trpc.io/docs/vanilla
 * @param pathAndInput tRPC client path and input.
 * @param options Options to pass to useAsyncData.
 */
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
  const key = `${pathAndInput[0]}-${objectHash(pathAndInput[1] ? JSON.stringify(pathAndInput[1]) : '')}`
  const serverError = useState<TError | null>(`error-${key}`, () => null)
  const { error, data, ...rest } = await useAsyncData(
    key,
    () => $client.query(...pathAndInput),
    // @ts-expect-error: Internal
    options,
  )

  if (process.server && error.value && !serverError.value)
    serverError.value = error.value as any

  if (data.value)
    serverError.value = null

  return {
    ...rest,
    data,
    error: serverError,
  } as any
}

/**
 * tRPC Client.
 *
 * @see https://trpc.io/docs/vanilla
 */
export function useClient(): TRPCClient<AppRouter> {
  const { $client } = useNuxtApp()
  return $client
}

/**
 * Additional header properties to pass to tRPC client.
 *
 * @see https://github.com/trpc/trpc/discussions/1686
 * @param initialValue
 */
export function useClientHeaders(initialValue?: MaybeRef<Record<string, any>>) {
  return useStorage('trpc-nuxt-header', initialValue || {})
}
