import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Playwright owns the runtime e2e suite, so this project is type tests only.
    include: [],
    typecheck: {
      enabled: true,
      only: true,
      include: ['test-types/**/*.test-d.ts'],
      tsconfig: './test-types/tsconfig.json',
    },
  },
});
