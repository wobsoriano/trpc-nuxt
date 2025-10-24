import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/client/index.ts', 'src/server/index.ts'],
  format: ['esm'],
  clean: true,
  external: ['nuxt/app', 'vue', /@trpc\/client/, /@trpc\/server/],
  dts: true,
});
