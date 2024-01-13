import { type inferRouterProxyClient } from '@trpc/client'
import { createRecursiveProxy, type AnyRouter } from '@trpc/core'
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData, unref, ref, isRef, toRaw } from '#imports'
import { getQueryKeyInternal } from './getQueryKey'

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

      const queryKey = customQueryKey || getQueryKeyInternal(path, unref(input))
      const watch = isRef(input) ? [...(asyncDataOptions.watch || []), input] : asyncDataOptions.watch
      const isLazy = lastArg === 'useLazyQuery' ? true : (asyncDataOptions.lazy || false)
  
      return useAsyncData(queryKey, () => (client as any)[path].query(unref(input), {
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
      
      const payload = ref(null)

      const controller = createAbortController(trpc);
  
      const asyncData = useAsyncData(() => (client as any)[path].mutate(payload.value, {
        signal: controller?.signal,
        ...trpc
      }), {
        ...asyncDataOptions,
        immediate: false
      })

      // eslint-disable-next-line no-inner-declarations
      async function mutate (input: any) {
        payload.value = input
        await asyncData.execute()
        return toRaw(asyncData.data.value)
      }

      Object.assign(asyncData, { mutate })

      return asyncData
    }
    
    return (client as any)[path][lastArg](...args)
  })
}
