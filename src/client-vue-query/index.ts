import { useQuery, useMutation } from "@tanstack/vue-query";
import {
  type CreateTRPCClientOptions,
  type inferRouterProxyClient,
  createTRPCProxyClient,
} from "@trpc/client";
import { type AnyRouter } from "@trpc/server";
import { createFlatProxy, createRecursiveProxy } from "@trpc/server/shared";
import { type DecoratedProcedureRecord } from "./types";
// @ts-expect-error: Nuxt auto-imports
import { getCurrentInstance, onScopeDispose, useAsyncData } from "#imports";
import { getQueryKey } from "./internals/getQueryKey";
import { getArrayQueryKey } from "./internals/getArrayQueryKey";

export function getClientArgs<TPathAndInput extends unknown[], TOptions>(
  pathAndInput: TPathAndInput,
  opts: TOptions
) {
  const [path, input] = pathAndInput;
  return [path, input, (opts as any)?.trpc] as const;
}

export function createNuxtProxyDecoration<TRouter extends AnyRouter>(
  name: string,
  client: inferRouterProxyClient<TRouter>
) {
  return createRecursiveProxy((opts) => {
    const args = opts.args;

    const pathCopy = [name, ...opts.path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!;

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join(".");

    if (lastArg === "useMutation") {
      const actualPath = Array.isArray(path) ? path[0] : path;
      return useMutation({
        ...args,
        mutationKey: [actualPath.split(".")],
        mutationFn: (input: any) => (client as any)[actualPath].mutate(input),
      });
    }

    const [input, ...rest] = args;

    const queryKey = getQueryKey(path, input);

    // Expose queryKey helper
    if (lastArg === "getQueryKey") {
      return getArrayQueryKey(queryKey, (rest[0] as any) ?? "any");
    }

    if (lastArg === "useQuery") {
      const { trpc, ...options } = rest[0] || ({} as any);
      return useQuery({
        ...options,
        queryKey,
        queryFn: () => (client as any)[path].query(input, trpc),
      });
    }

    return (client as any)[path][lastArg](input);
  });
}

export function createTRPCNuxtClient<TRouter extends AnyRouter>(
  opts: CreateTRPCClientOptions<TRouter>
) {
  const client = createTRPCProxyClient<TRouter>(opts);

  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client);
  }) as DecoratedProcedureRecord<TRouter["_def"]["record"], TRouter>;

  return decoratedClient;
}

export { httpBatchLink, httpLink } from "../client-shared/links";
