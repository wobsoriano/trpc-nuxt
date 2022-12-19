import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client/index.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  external: ['#app', '#imports', /@trpc\/client/, /@trpc\/server/],
  dts: true,
  outExtension ({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`
    }
  }
})
