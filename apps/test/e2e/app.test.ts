import { expect, test } from '@nuxt/test-utils/playwright';
import type { APIRequestContext } from '@playwright/test';

test('basic', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' });
  await expect(page.getByRole('heading')).toHaveText('Hello client');
});

test('query and mutation', async ({ page, goto }) => {
  await goto('/counter', { waitUntil: 'hydration' });
  await expect(page.getByRole('heading')).toHaveText('Count: 0');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading')).toHaveText('Count: 1');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading')).toHaveText('Count: 2');

  // Test getQueryKey function
  await page.getByRole('link', { name: 'Go to query key' }).click();
  await expect(page.getByRole('heading')).toHaveText('Count: 2');
});

test('context', async ({ page, goto }) => {
  await goto('/resolver', { waitUntil: 'hydration' });
  await expect(page.getByRole('heading')).toHaveText('abc_123');
});

test('FormData', async ({ page, goto }) => {
  await goto('/form', { waitUntil: 'hydration' });
  await expect(page.getByRole('heading')).toHaveText('Welcome, Guest');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading')).toHaveText('Welcome, John Doe');
});

test('subscription', async ({ page, goto }) => {
  await goto('/subscription', { waitUntil: 'hydration' });

  // Wait for subscription to connect
  await expect(page.getByText('Status:')).toBeVisible();
  await expect(page.getByText('Status: pending')).toBeVisible({ timeout: 5000 });

  // Click button to increment count (triggers mutation that emits to subscription)
  await page.getByRole('button', { name: 'Increment Count' }).click();

  // Should receive the new value (1) - this confirms subscription is working
  await expect(page.getByText('Last value: 1')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/Received values:.*1/)).toBeVisible();

  // Click again
  await page.getByRole('button', { name: 'Increment Count' }).click();

  // Should receive the new value (2)
  await expect(page.getByText('Last value: 2')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/Received values:.*2/)).toBeVisible();
});

async function h3Query(request: APIRequestContext, path: string, input?: unknown) {
  const search =
    input === undefined ? '' : `?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const response = await request.get(`/api/trpc-h3/${path}${search}`);
  expect(response.ok()).toBe(true);
  return (await response.json()).result.data.json;
}

async function h3Mutation(request: APIRequestContext, path: string, input: unknown) {
  const response = await request.post(`/api/trpc-h3/${path}`, { data: { json: input } });
  expect(response.ok()).toBe(true);
  return (await response.json()).result.data.json;
}

test('trpc-nuxt/server handler: query', async ({ request }) => {
  expect(await h3Query(request, 'hello', { text: 'h3' })).toEqual({ greeting: 'Hello h3' });
});

test('trpc-nuxt/server handler: mutation is visible to a later query', async ({ request }) => {
  const previous = await h3Query(request, 'getCount');
  const next = previous + 40;

  expect(await h3Mutation(request, 'setCount', next)).toBe(next);
  expect(await h3Query(request, 'getCount')).toBe(next);

  await h3Mutation(request, 'setCount', previous);
  expect(await h3Query(request, 'getCount')).toBe(previous);
});

test('trpc-nuxt/server handler: context reads event.context set by middleware', async ({
  request,
}) => {
  expect(await h3Query(request, 'getUserId')).toBe('abc_123');
});
