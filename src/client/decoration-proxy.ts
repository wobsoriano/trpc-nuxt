import type { TRPCClient } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import type { AsyncDataExecuteOptions } from './nuxt-types';
import { createTRPCRecursiveProxy } from '@trpc/server';
import { useAsyncData } from 'nuxt/app';
import { getCurrentInstance, isRef, onScopeDispose, shallowRef, toRaw, toValue, watch } from 'vue';
import { getMutationKeyInternal, getQueryKeyInternal } from './get-query-key';

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

      async function mutate(value: any, opts?: AsyncDataExecuteOptions) {
        input.value = value;
        await asyncData.execute(opts);
        return toRaw(asyncData.data.value);
      }

      Object.assign(asyncData, { mutate });

      return asyncData;
    }

    if (lastArg === 'useSubscription') {
      const { enabled, onStarted, onData, onError, onComplete, onConnectionStateChange, onStopped, trpc: trpcOpts } = otherOptions || {} as any;

      const status = shallowRef<'idle' | 'connecting' | 'pending' | 'error'>('idle');
      const data = shallowRef<any>(undefined);
      const error = shallowRef<any>(null);
      let unsubscribe: (() => void) | null = null;

      function subscribe() {
        // Unsubscribe from previous subscription
        unsubscribe?.();

        status.value = 'connecting';
        error.value = null;
        onConnectionStateChange?.('connecting');

        const sub = (client as any)[path].subscribe(toValue(input), {
          onStarted: (opts: any) => {
            status.value = 'pending';
            onStarted?.(opts);
            onConnectionStateChange?.('connected');
          },
          onData: (value: any) => {
            // The SSE link wraps data in { data: <actual> }, so extract it
            const actualData = value?.data ?? value;
            data.value = actualData;
            onData?.(actualData);
          },
          onError: (err: any) => {
            status.value = 'error';
            error.value = err;
            onError?.(err);
            onConnectionStateChange?.('error');
          },
          onComplete: () => {
            status.value = 'idle';
            onComplete?.();
            onConnectionStateChange?.('idle');
          },
          onConnectionStateChange: (state: any) => {
            // Pass through connection state changes from tRPC client (e.g., 'reconnecting')
            onConnectionStateChange?.(state);
            // Update our internal status if needed
            if (state === 'connected' && status.value !== 'pending') {
              status.value = 'pending';
            }
            else if (state === 'error' && status.value !== 'error') {
              status.value = 'error';
            }
            else if (state === 'idle' && status.value !== 'idle') {
              status.value = 'idle';
            }
            else if (state === 'connecting' && status.value !== 'connecting') {
              status.value = 'connecting';
            }
          },
          onStopped: () => {
            onStopped?.();
          },
          ...trpcOpts,
        });

        unsubscribe = () => {
          sub.unsubscribe();
          onStopped?.();
        };
      }

      function reset() {
        unsubscribe?.();
        status.value = 'idle';
        data.value = undefined;
        error.value = null;
        onConnectionStateChange?.('idle');

        if (toValue(enabled) !== false) {
          subscribe();
        }
      }

      // Watch for input/enabled changes (client-side only)
      if (import.meta.client) {
        // Start subscription immediately if enabled is not false
        if (toValue(enabled) !== false) {
          subscribe();
        }

        watch(
          () => [toValue(input), toValue(enabled)],
          ([_, isEnabled]) => {
            if (isEnabled === false) {
              unsubscribe?.();
              status.value = 'idle';
              onConnectionStateChange?.('idle');
            }
            else {
              subscribe();
            }
          },
          { immediate: false, deep: true },
        );
      }
      // Note: Subscriptions are client-side only (SSE doesn't work during SSR)

      // Auto-cleanup on scope dispose
      if (getCurrentInstance()) {
        onScopeDispose(() => unsubscribe?.());
      }

      return { status, data, error, reset };
    }

    return (client as any)[path][lastArg](...args);
  });
}
