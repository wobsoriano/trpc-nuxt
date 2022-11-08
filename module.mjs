import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'trpc-nuxt',
    configKey: 'trpc',
    compatibility: {
      nuxt: '^3.0.0-rc.13'
    }
  },
  setup (_moduleOptions, nuxt) {
    nuxt.options.build.transpile.push('trpc-nuxt')
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || []
    nuxt.options.vite.optimizeDeps.exclude.push('trpc-nuxt/client')
  }
})
