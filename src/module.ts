import { fileURLToPath } from 'url'
import { join, resolve } from 'pathe'
import { defu } from 'defu'
// @ts-expect-error: No types
import dedent from 'dedent'

import { addAutoImport, addPlugin, addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  baseURL: string
  trpcURL: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'trpc-nuxt',
    configKey: 'trpc',
  },
  defaults: {
    baseURL: 'http://localhost:3000',
    trpcURL: '/api/trpc',
  },
  async setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, '#build/trpc-handler')

    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    const trpcOptionsPath = join(nuxt.options.srcDir, 'server/trpc')

    // Add vueuse
    nuxt.options.modules.push('@vueuse/nuxt')

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.public.trpc = defu(nuxt.options.runtimeConfig.public.trpc, {
      baseURL: options.baseURL,
      trpcURL: options.trpcURL,
    })

    addAutoImport([
      { name: 'useClient', from: join(runtimeDir, 'client') },
      { name: 'useAsyncQuery', from: join(runtimeDir, 'client') },
      { name: 'useClientHeaders', from: join(runtimeDir, 'client') },
    ])

    addServerHandler({
      route: `${finalConfig.trpcURL}/*`,
      handler: handlerPath,
    })

    addPlugin(resolve(runtimeDir, 'plugin'))

    addTemplate({
      filename: 'trpc-handler.ts',
      write: true,
      getContents() {
        return dedent`
          import { createTRPCHandler } from 'trpc-nuxt/api'
          import * as functions from '${trpcOptionsPath}'
    
          export default createTRPCHandler({
            ...functions,
            endpoint: '${finalConfig.trpcURL}'
          })
        `
      },
    })
  },
})

