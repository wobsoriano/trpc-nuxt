import { type inferRouterProxyClient } from '@trpc/client'
import { type AnyRouter } from '@trpc/server'
import { createRecursiveProxy } from '@trpc/server/shared'
import { getCurrentInstance, onScopeDispose, toValue, shallowRef, isRef, toRaw } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { getQueryKeyInternal } from './getQueryKey'

function isRefOrGetter<T>(val: T): boolean {
  return isRef(val) || typeof val === 'function';
}

function createAbortController(trpc: any) {
  let controller: AbortController | undefined;

  if (trpc?.abortOnUnmount) {
    if (getCurrentInstance()) {
      onScopeDispose(() => {
        controller?.abort?.()
      })
    }
    controller = typeof AbortController !== 'undefined' ? new AbortController() : {} as AbortController
  }

  return controller;
}

export function createNuxtProxyDecoration<TRouter extends AnyRouter> (name: string, client: inferRouterProxyClient<TRouter>) {
  return createRecursiveProxy((opts) => {
    const args = opts.args

    const pathCopy = [name, ...opts.path]

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join('.')

    const [input, otherOptions] = args

    if (lastArg === '_def') {
      return {
        path: pathCopy,
      };
    }

    if (['useQuery', 'useLazyQuery'].includes(lastArg)) {
      const { trpc, queryKey: customQueryKey, ...asyncDataOptions } = otherOptions || {} as any

      const controller = createAbortController(trpc);

      const queryKey = customQueryKey || getQueryKeyInternal(path, toValue(input))
      const watch = asyncDataOptions.watch === false ? [] : isRefOrGetter(input) ? [...(asyncDataOptions.watch || []), input] : asyncDataOptions.watch
      const isLazy = lastArg === 'useLazyQuery' ? true : (asyncDataOptions.lazy || false)

      return useAsyncData(queryKey, () => (client as any)[path].query(toValue(input), {
        signal: controller?.signal,
        ...trpc
      }), {
        ...asyncDataOptions,
        watch,
        lazy: isLazy
      })
    }

    if (lastArg === 'useMutation') {
      const { trpc, ...asyncDataOptions } = otherOptions || {} as any

      const input = shallowRef(null);

      const controller = createAbortController(trpc);

      const asyncData = useAsyncData(() => (client as any)[path].mutate(toRaw(input.value), {
        signal: controller?.signal,
        ...trpc
      }), {
        ...asyncDataOptions,
        lazy: false,
        immediate: false,
        server: false,
      })


      async function mutate (input: any) {
        input.value = input
        await asyncData.execute()
        return toRaw(asyncData.data.value)
      }

      Object.assign(asyncData, { mutate })

      return asyncData
    }

    return (client as any)[path][lastArg](...args)
  })
}
