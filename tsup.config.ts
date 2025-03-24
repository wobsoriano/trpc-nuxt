import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/client/index.ts', 'src/server/index.ts'],
  format: ['esm'],
  splitting: true,
  clean: true,
  external: ['nuxt', 'vue', /@trpc\/client/, /@trpc\/server/],
  dts: true,
});
