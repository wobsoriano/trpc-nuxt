import type {
  AsyncData,
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import type { AsyncDataOptions, NuxtApp } from '#app'
// @ts-expect-error: Resolved by Nuxt
import { useAsyncData, useState } from '#imports'

export async function useTRPCAsyncData<
  DataT,
  DataE = Error,
  Transform extends _Transform<DataT> = _Transform<DataT, DataT>,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
>(
  key: string,
  handler: (ctx?: NuxtApp) => Promise<DataT>,
  options: AsyncDataOptions<DataT, Transform, PickKeys> = {},
): Promise<AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, DataE | null | true>> {
  const serverError = useState<DataE | true | null>(`error-${key}`, () => null)
  const { error, data, ...rest } = await useAsyncData(key, handler, options)

  // Only set the value on server and if serverError is empty
  if (process.server && error.value && !serverError.value)
    serverError.value = error.value as DataE | true | null

  // Clear error if data is available
  if (data.value)
    serverError.value = null

  return {
    ...rest,
    data,
    error: serverError,
  }
}
