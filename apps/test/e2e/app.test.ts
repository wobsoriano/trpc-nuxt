import { expect, test } from '@nuxt/test-utils/playwright'

test('basic', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('Hello client')
})

test('query and mutation', async ({ page, goto }) => {
  await goto('/counter', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('Count: 0')
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.getByRole('heading')).toHaveText('Count: 1')
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.getByRole('heading')).toHaveText('Count: 2')
})

test('context', async ({ page, goto }) => {
  await goto('/resolver', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('abc_123')
})

test('FormData', async ({ page, goto }) => {
  await goto('/form', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('Welcome, User')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('heading')).toHaveText('Welcome, John Doe')
})
