import { defineConfig } from 'vite-plus/test/config';

export default defineConfig({
  test: {
    // playwright owns the runtime suite, this project is type tests only
    include: [],
    typecheck: {
      enabled: true,
      only: true,
      include: ['test-types/**/*.test-d.ts'],
      tsconfig: './test-types/tsconfig.json',
    },
  },
});
