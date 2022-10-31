import { defineNuxtModule, extendViteConfig } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'trpc-nuxt',
    configKey: 'trpc',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  async setup(_moduleOptions, nuxt) {
    nuxt.options.build.transpile.push('trpc-nuxt')

    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push('trpc-nuxt/client')
    })
  },
})
