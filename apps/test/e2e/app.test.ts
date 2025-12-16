import { expect, test } from '@nuxt/test-utils/playwright';

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
