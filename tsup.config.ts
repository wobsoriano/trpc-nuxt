import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client/index.ts', 'src/server/index.ts'],
  format: ['esm'],
  splitting: false,
  clean: true,
  external: ['#app', '#imports', /@trpc\/client/, /@trpc\/server/],
  dts: true,
})
