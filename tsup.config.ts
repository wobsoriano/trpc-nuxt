import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client/index.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  clean: true,
  external: ['#app'],
  dts: true,
  // @ts-expect-error: Missing type
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : `.${format}`,
    }
  },
})
