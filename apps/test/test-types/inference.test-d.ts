// Type-level regression guard for the *published* declarations.
//
// This consumes `trpc-nuxt/client` the way a real app does, so it typechecks
// `dist/**/*.d.mts` rather than `src`. Nuxt sets `skipLibCheck: true` by
// default, so a broken import inside our shipped `.d.mts` does not error, it
// silently resolves to `any` and takes `data` / `data.value` with it.
//
// NOTE: `toEqualTypeOf` does NOT catch that failure. When a module in a `.d.mts`
// cannot be resolved, TS produces its *error* type, which is mutually assignable
// with everything and short-circuits the conditional types `toEqualTypeOf` is
// built on, so it reports a false pass. `not.toBeAny()` and `@ts-expect-error`
// both catch it. Keep at least one of those per assertion group.
//
// See https://github.com/wobsoriano/trpc-nuxt/issues/255

import { createTRPCNuxtClient } from 'trpc-nuxt/client';
import { assertType, describe, expectTypeOf, test } from 'vitest';

import type { AppRouter } from '../server/trpc/routers';

declare const client: ReturnType<typeof createTRPCNuxtClient<AppRouter>>;

describe('useQuery', () => {
  const query = client.hello.useQuery({ text: 'world' });

  test('data is inferred, not any', () => {
    expectTypeOf(query.data).not.toBeAny();
    expectTypeOf(query.data.value).not.toBeAny();
    expectTypeOf(query.data.value).toEqualTypeOf<{ greeting: string } | undefined>();
  });

  test('output shape is enforced', () => {
    expectTypeOf(query.data.value?.greeting).toEqualTypeOf<string | undefined>();

    // @ts-expect-error `greeting` is a string, not a number.
    assertType<number | undefined>(query.data.value?.greeting);

    // @ts-expect-error `nope` is not a property of the query output.
    void query.data.value?.nope;
  });

  test('input shape is enforced', () => {
    // @ts-expect-error `hello` takes `{ text: string }`, not a number.
    void client.hello.useQuery(123);
  });

  test('direct resolver is inferred', () => {
    expectTypeOf(client.hello.query).returns.resolves.not.toBeAny();
    expectTypeOf(client.hello.query).returns.resolves.toEqualTypeOf<{ greeting: string }>();
  });
});

describe('useMutation', () => {
  const mutation = client.setCount.useMutation();

  test('data is inferred, not any', () => {
    expectTypeOf(mutation.data).not.toBeAny();
    expectTypeOf(mutation.data.value).not.toBeAny();
    expectTypeOf(mutation.data.value).toEqualTypeOf<number | undefined>();
  });

  test('output shape is enforced', () => {
    // @ts-expect-error `setCount` returns a number, not a string.
    assertType<string | undefined>(mutation.data.value);
  });

  test('input shape is enforced', () => {
    // @ts-expect-error `setCount` takes a number, not a string.
    void mutation.mutate('nope');
  });

  test('direct resolver is inferred', () => {
    expectTypeOf(client.setCount.mutate).returns.resolves.not.toBeAny();
    expectTypeOf(client.setCount.mutate).returns.resolves.toEqualTypeOf<number>();
  });
});
