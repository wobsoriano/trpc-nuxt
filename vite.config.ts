import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    semi: true,
    experimentalSortPackageJson: true,
    sortImports: {
      groups: [
        ['type-import'],
        ['type-builtin', 'value-builtin'],
        ['type-external', 'value-external', 'type-internal', 'value-internal'],
        [
          'type-parent',
          'type-sibling',
          'type-index',
          'value-parent',
          'value-sibling',
          'value-index',
        ],
        ['unknown'],
      ],
      newlinesBetween: true,
      order: 'asc',
    },
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
      neverBundle: ['#imports', 'nuxt/app', 'vue', 'h3', /@trpc\/client/, /@trpc\/server/],
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
      'test:types': {
        command: 'vp test',
        cwd: 'apps/test',
        dependsOn: ['build:lib'],
        // vp test writes its run cache under node_modules/.vite
        input: [{ auto: true }, '!apps/test/.nuxt/**', '!apps/test/node_modules/**'],
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
