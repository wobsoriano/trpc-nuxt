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
    entry: ['./src/client/index.ts', './src/server/index.ts'],
    clean: true,
    deps: {
      neverBundle: ['nuxt/app', 'vue', /@trpc\/client/, /@trpc\/server/],
    },
    dts: true,
  },
  run: {
    cache: {
      scripts: true,
      tasks: true,
    },
    tasks: {
      'build:lib': {
        command: 'vp pack',
        input: [{ auto: true }, '!dist/**'],
      },
      test: {
        command: 'vp exec playwright test',
        cwd: 'apps/test',
        dependsOn: ['build:lib'],
        input: [
          { auto: true },
          '!apps/test/.nuxt/**',
          '!apps/test/test-results/**',
          '!apps/test/playwright-report/**',
        ],
      },
      'build:playground': {
        command: 'vp exec nuxi build',
        cwd: 'apps/playground',
        dependsOn: ['build:lib'],
        input: [{ auto: true }, '!apps/playground/.nuxt/**', '!apps/playground/.output/**'],
      },
      'build:docs': {
        command: 'vp exec astro build',
        cwd: 'apps/docs',
        input: [{ auto: true }, '!apps/docs/dist/**'],
      },
    },
  },
});
