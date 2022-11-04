import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client/index.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  external: ['#app', '#imports'],
  dts: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`,
    }
  },
})
