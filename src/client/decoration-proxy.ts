import { useAsyncData } from '#imports';
import type { AsyncDataOptions } from 'nuxt/app';
import type { TRPCClient, TRPCRequestOptions } from '@trpc/client';
import type { TRPCConnectionState } from '@trpc/client/unstable-internals';
import type { AnyTRPCRouter } from '@trpc/server';
import { createTRPCRecursiveProxy } from '@trpc/server';
import { getCurrentInstance, isRef, onScopeDispose, shallowRef, toRaw, toValue, watch } from 'vue';

import { getMutationKeyInternal, getQueryKeyInternal } from './get-query-key';
import type { AsyncDataExecuteOptions } from './nuxt-types';

function isRefOrGetter<T>(val: T): boolean {
  return isRef(val) || typeof val === 'function';
}

function createAbortController(trpc?: TRPCRequestOptions & { abortOnUnmount?: boolean }) {
  let controller: AbortController | undefined;

  if (trpc?.abortOnUnmount) {
    if (getCurrentInstance()) {
      onScopeDispose(() => {
        controller?.abort?.();
      });
    }
    controller =
      typeof AbortController !== 'undefined' ? new AbortController() : ({} as AbortController);
  }

  return controller;
}

function handleUseQuery(
  client: any,
  path: string,
  input: any,
  options?: {
    queryKey?: string;
    watch?: AsyncDataOptions<any, any, any>['watch'] | false;
    trpc?: TRPCRequestOptions & { abortOnUnmount?: boolean };
    transform?: AsyncDataOptions<any, any, any>['transform'];
    default?: () => undefined;
  },
) {
  const {
    trpc,
    queryKey: customQueryKey,
    transform,
    default: defaultFn,
    watch: optsWatch,
    ...asyncDataOptions
  } = options || {};

  const controller = createAbortController(trpc);

  const queryKey = customQueryKey || getQueryKeyInternal(path, toValue(input));
  const watchSources = isRefOrGetter(input) ? [...(optsWatch || []), input] : optsWatch;

  return useAsyncData(
    queryKey,
    () =>
      client[path].query(toValue(input), {
        signal: controller?.signal,
        ...trpc,
      }),
    {
      ...asyncDataOptions,
      watch: watchSources as any,
      transform,
      default: defaultFn,
    },
  );
}

function handleUseMutation(
  client: any,
  path: string,
  options?: {
    mutationKey?: string;
    trpc?: TRPCRequestOptions & { abortOnUnmount?: boolean };
    transform?: AsyncDataOptions<any, any, any>['transform'];
    default?: () => undefined;
  },
) {
  const {
    trpc,
    mutationKey: customMutationKey,
    transform,
    default: defaultFn,
    ...asyncDataOptions
  } = options || {};

  const input = shallowRef(null);

  const controller = createAbortController(trpc);

  const mutationKey = customMutationKey || getMutationKeyInternal(path);
  const asyncData = useAsyncData(
    mutationKey,
    () =>
      client[path].mutate(toRaw(input.value), {
        signal: controller?.signal,
        ...trpc,
      }),
    {
      ...asyncDataOptions,
      lazy: false,
      server: false,
      immediate: false,
      transform,
      default: defaultFn,
    },
  );

  async function mutate(value: any, opts?: AsyncDataExecuteOptions) {
    input.value = value;
    await asyncData.execute(opts);
    return toRaw(asyncData.data.value);
  }

  function clear() {
    input.value = null;
    asyncData.data.value = undefined;
    asyncData.error.value = undefined;
    asyncData.status.value = 'idle';
  }

  Object.assign(asyncData, { mutate, clear });

  return asyncData;
}

function handleUseSubscription(client: any, path: string, input: any, options: any) {
  const {
    enabled,
    onStarted,
    onData,
    onError,
    onComplete,
    onConnectionStateChange,
    onStopped,
    trpc: trpcOpts,
  } = options || ({} as any);

  const status = shallowRef<'idle' | 'connecting' | 'pending' | 'error'>('idle');
  const data = shallowRef<any>(undefined);
  const error = shallowRef<any>(null);
  let unsubscribe: (() => void) | null = null;

  function subscribe() {
    // Unsubscribe from previous subscription
    unsubscribe?.();

    status.value = 'connecting';
    error.value = null;
    onConnectionStateChange?.({ type: 'state', state: 'connecting', error: null });

    const sub = client[path].subscribe(toValue(input), {
      onStarted: (opts: any) => {
        status.value = 'pending';
        onStarted?.(opts);
        onConnectionStateChange?.({ type: 'state', state: 'pending', error: null });
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
        onConnectionStateChange?.({ type: 'state', state: 'connecting', error: err });
      },
      onComplete: () => {
        status.value = 'idle';
        onComplete?.();
        onConnectionStateChange?.({ type: 'state', state: 'idle', error: null });
      },
      onConnectionStateChange: (state: TRPCConnectionState<any>) => {
        // Pass through connection state changes from tRPC client (e.g., 'reconnecting')
        onConnectionStateChange?.(state);
        // Update our internal status if needed
        if (state.state === 'pending' && status.value !== 'pending') {
          status.value = 'pending';
        } else if (state.error && status.value !== 'error') {
          status.value = 'error';
        } else if (state.state === 'idle' && status.value !== 'idle') {
          status.value = 'idle';
        } else if (state.state === 'connecting' && status.value !== 'connecting') {
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
    onConnectionStateChange?.({ type: 'state', state: 'idle', error: null });

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
          onConnectionStateChange?.({ type: 'state', state: 'idle', error: null });
        } else {
          subscribe();
        }
      },
      { immediate: false },
    );
  }

  if (getCurrentInstance()) {
    onScopeDispose(() => unsubscribe?.());
  }

  return { status, data, error, reset };
}

export function createNuxtProxyDecoration<TRouter extends AnyTRPCRouter>(
  name: string | number | symbol,
  client: TRPCClient<TRouter>,
) {
  return createTRPCRecursiveProxy((opts) => {
    const pathCopy = [name, ...opts.path];
    const lastArg = pathCopy.pop()!;
    const path = pathCopy.join('.');
    const [input, otherOptions] = opts.args;

    if (lastArg === '_def') {
      return { path: pathCopy };
    }

    if (lastArg === 'useQuery') {
      return handleUseQuery(client, path, input, otherOptions as any);
    }

    if (lastArg === 'useMutation') {
      return handleUseMutation(client, path, otherOptions as any);
    }

    if (lastArg === 'useSubscription') {
      return handleUseSubscription(client, path, input, otherOptions);
    }

    return (client as any)[path][lastArg](...opts.args);
  });
}
