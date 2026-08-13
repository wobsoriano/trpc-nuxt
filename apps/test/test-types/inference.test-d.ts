// Typechecks a consumer against the built `dist`, not `src`.
// @see https://github.com/wobsoriano/trpc-nuxt/issues/255

import { createTRPCNuxtClient } from 'trpc-nuxt/client';
import { assertType, describe, expectTypeOf, test } from 'vite-plus/test';

import type { AppRouter } from '../server/trpc/routers';

declare const client: ReturnType<typeof createTRPCNuxtClient<AppRouter>>;

describe('useQuery', () => {
  const query = client.hello.useQuery({ text: 'world' });

  test('data is inferred', () => {
    // `toEqualTypeOf` alone passes here even when inference is broken: an
    // unresolvable module in a `.d.mts` yields TS's error type, which satisfies it.
    expectTypeOf(query.data.value).not.toBeAny();
    expectTypeOf(query.data.value).toEqualTypeOf<{ greeting: string } | undefined>();
  });

  test('output shape is enforced', () => {
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

  test('data is inferred', () => {
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
