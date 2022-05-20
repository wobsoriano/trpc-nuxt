import { fileURLToPath } from 'url'
import { join } from 'pathe'
import { defu } from 'defu'

import { addServerHandler, addTemplate, defineNuxtModule } from '@nuxt/kit'

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
    nuxt.options.build.transpile.push(runtimeDir, '#build/trpc-client', '#build/trpc-handler')

    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')
    nuxt.options.build.transpile.push(handlerPath)

    // Final resolved configuration
    const finalConfig = nuxt.options.runtimeConfig.public.trpc = defu(nuxt.options.runtimeConfig.public.trpc, {
      baseURL: options.baseURL,
      trpcURL: options.trpcURL,
    })

    nuxt.hook('autoImports:extend', (imports) => {
      imports.push(
        { name: 'useClient', from: '#build/trpc-client' },
        { name: 'useAsyncQuery', from: join(runtimeDir, 'client') },
      )
    })

    addServerHandler({
      route: `${finalConfig.trpcURL}/*`,
      handler: handlerPath,
    })

    addTemplate({
      filename: 'trpc-client.ts',
      write: true,
      getContents() {
        return `
          import * as trpc from '@trpc/client'
          import type { router } from '~/server/trpc'
    
          const client = trpc.createTRPCClient<typeof router>({
            url: '${finalConfig.baseURL}${finalConfig.trpcURL}',
          })
        
          export const useClient = () => client
        `
      },
    })

    addTemplate({
      filename: 'trpc-handler.ts',
      write: true,
      getContents() {
        return `
          import { createTRPCHandler } from 'trpc-nuxt/api'
          import { useRuntimeConfig } from '#imports'
          import * as functions from '~/server/trpc'
    
          const { trpc: { trpcURL } } = useRuntimeConfig().public
    
          export default createTRPCHandler({
            ...functions,
            trpcURL 
          })
        `
      },
    })
  },
})

