import type { TRPCClient } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import { createTRPCRecursiveProxy } from '@trpc/server';
import { useAsyncData } from 'nuxt/app';
import { getCurrentInstance, isRef, onScopeDispose, shallowRef, toRaw, toValue } from 'vue';
import { getMutationKeyInternal, getQueryKeyInternal } from './getQueryKey';

function isRefOrGetter<T>(val: T): boolean {
  return isRef(val) || typeof val === 'function';
}

function createAbortController(trpc: any) {
  let controller: AbortController | undefined;

  if (trpc?.abortOnUnmount) {
    if (getCurrentInstance()) {
      onScopeDispose(() => {
        controller?.abort?.();
      });
    }
    controller = typeof AbortController !== 'undefined' ? new AbortController() : {} as AbortController;
  }

  return controller;
}

export function createNuxtProxyDecoration<TRouter extends AnyTRPCRouter>(name: string | number | symbol, client: TRPCClient<TRouter>) {
  return createTRPCRecursiveProxy((opts) => {
    const args = opts.args;

    const pathCopy = [name, ...opts.path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!;

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join('.');

    const [input, otherOptions] = args;

    if (lastArg === '_def') {
      return {
        path: pathCopy,
      };
    }

    if (lastArg === 'useQuery') {
      const { trpc, queryKey: customQueryKey, ...asyncDataOptions } = otherOptions || {} as any;

      const controller = createAbortController(trpc);

      const queryKey = customQueryKey || getQueryKeyInternal(path, toValue(input));
      const watch = isRefOrGetter(input) ? [...(asyncDataOptions.watch || []), input] : asyncDataOptions.watch;

      return useAsyncData(queryKey, () => (client as any)[path].query(toValue(input), {
        signal: controller?.signal,
        ...trpc,
      }), {
        ...asyncDataOptions,
        watch,
      });
    }

    if (lastArg === 'useMutation') {
      const { trpc, mutationKey: customMutationKey, ...asyncDataOptions } = otherOptions || {} as any;

      const input = shallowRef(null);

      const controller = createAbortController(trpc);

      const mutationKey = customMutationKey || getMutationKeyInternal(path);
      const asyncData = useAsyncData(mutationKey, () => (client as any)[path].mutate(toRaw(input.value), {
        signal: controller?.signal,
        ...trpc,
      }), {
        ...asyncDataOptions,
        lazy: false,
        server: false,
        immediate: false,
      });

      async function mutate(value: any) {
        input.value = value;
        await asyncData.execute();
        return toRaw(asyncData.data.value);
      }

      Object.assign(asyncData, { mutate });

      return asyncData;
    }

    return (client as any)[path][lastArg](...args);
  });
}
