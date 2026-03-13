import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    semi: false,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  pack: {
    entry: ['src/client/index.ts', 'src/server/index.ts'],
    format: ['esm'],
    clean: true,
    external: ['nuxt/app', 'vue', /@trpc\/client/, /@trpc\/server/],
    dts: true,
  },
})
