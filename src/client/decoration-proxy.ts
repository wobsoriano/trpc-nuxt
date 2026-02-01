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

function handleUseQuery(client: any, path: string, input: any, options: any) {
  const { trpc, queryKey: customQueryKey, ...asyncDataOptions } = options || {} as any;

  const controller = createAbortController(trpc);

  // Make queryKey a getter so it updates when input changes
  // This ensures useAsyncData uses the correct cache key for reactive inputs
  const queryKey = customQueryKey
    ? (isRefOrGetter(customQueryKey) ? customQueryKey : () => customQueryKey)
    : () => getQueryKeyInternal(path, toValue(input));

  const watch = isRefOrGetter(input) ? [...(asyncDataOptions.watch || []), input] : asyncDataOptions.watch;

  return useAsyncData(queryKey, () => client[path].query(toValue(input), {
    signal: controller?.signal,
    ...trpc,
  }), {
    ...asyncDataOptions,
    watch,
  });
}

function handleUseMutation(client: any, path: string, options: any) {
  const { trpc, mutationKey: customMutationKey, ...asyncDataOptions } = options || {} as any;

  const input = shallowRef(null);

  const controller = createAbortController(trpc);

  const mutationKey = customMutationKey || getMutationKeyInternal(path);
  const asyncData = useAsyncData(mutationKey, () => client[path].mutate(toRaw(input.value), {
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

function handleUseSubscription(client: any, path: string, input: any, options: any) {
  const { enabled, onStarted, onData, onError, onComplete, onConnectionStateChange, onStopped, trpc: trpcOpts } = options || {} as any;

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

    const sub = client[path].subscribe(toValue(input), {
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

  if (getCurrentInstance()) {
    onScopeDispose(() => unsubscribe?.());
  }

  return { status, data, error, reset };
}

export function createNuxtProxyDecoration<TRouter extends AnyTRPCRouter>(name: string | number | symbol, client: TRPCClient<TRouter>) {
  return createTRPCRecursiveProxy((opts) => {
    const pathCopy = [name, ...opts.path];
    const lastArg = pathCopy.pop()!;
    const path = pathCopy.join('.');
    const [input, otherOptions] = opts.args;

    if (lastArg === '_def') {
      return { path: pathCopy };
    }

    if (lastArg === 'useQuery') {
      return handleUseQuery(client, path, input, otherOptions);
    }

    if (lastArg === 'useMutation') {
      return handleUseMutation(client, path, otherOptions);
    }

    if (lastArg === 'useSubscription') {
      return handleUseSubscription(client, path, input, otherOptions);
    }

    return (client as any)[path][lastArg](...opts.args);
  });
}
