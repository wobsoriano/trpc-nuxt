import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { "index": 'src/index.ts', "client/index": 'src/client/index.ts',  "client-vue-query/index":  'src/client-vue-query/index.ts' },
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  external: ['#app', '#imports', /@trpc\/client/, /@trpc\/client-vue-query/, /@trpc\/server/],
  dts: true,
  outExtension ({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`
    }
  }
})
