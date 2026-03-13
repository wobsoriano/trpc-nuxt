import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    semi: true,
  },
  lint: {
    plugins: ['import', 'jsdoc', 'vue'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['src/client/index.ts', 'src/server/index.ts'],
    clean: true,
    deps: {
      neverBundle: ['nuxt/app', 'vue', /@trpc\/client/, /@trpc\/server/],
    },
    dts: true,
  },
});
