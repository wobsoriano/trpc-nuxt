import { fileURLToPath } from 'url'
import { join, resolve } from 'pathe'
import { defu } from 'defu'
import dedent from 'dedent'

import { addImports, addPlugin, addServerHandler, addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit'

export interface ModuleOptions {
  baseURL: string
  endpoint: string
  installPlugin?: boolean
}

const metaName = 'trpc-nuxt'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: metaName,
    configKey: 'trpc',
  },
  defaults: {
    baseURL: '',
    endpoint: '/trpc',
    installPlugin: true,
  },
  async setup(options, nuxt) {
    const logger = useLogger(metaName)

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir, '#build/trpc-handler')

    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    const trpcOptionsPath = join(nuxt.options.srcDir, 'server/trpc')

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.public.trpc = defu(nuxt.options.runtimeConfig.public.trpc, {
      baseURL: options.baseURL,
      endpoint: options.endpoint,
      installPlugin: options.installPlugin,
    })

    addServerHandler({
      route: `${finalConfig.endpoint}/*`,
      handler: handlerPath,
    })

    addTemplate({
      filename: 'trpc-handler.ts',
      write: true,
      getContents() {
        return dedent`
          import { createTRPCHandler } from 'trpc-nuxt/api'
          import * as functions from '${trpcOptionsPath}'
    
          export default createTRPCHandler({
            ...functions,
            endpoint: '${finalConfig.endpoint}'
          })
        `
      },
    })

    if (finalConfig.installPlugin) {
      addImports([
        { name: 'useClient', from: join(runtimeDir, 'client') },
        { name: 'useAsyncQuery', from: join(runtimeDir, 'client') },
        { name: 'useClientHeaders', from: join(runtimeDir, 'client') },
        { name: 'getQueryKey', from: join(runtimeDir, 'client') },
      ])

      addPlugin(resolve(runtimeDir, 'plugin'))

      logger.success('Plugin successfully installed.')
    }
    else {
      logger.info('Plugin not installed. Create your own @trpc/client client plugin and composables.')
    }
  },
})

