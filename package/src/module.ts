import { fileURLToPath } from 'url'
import { dirname, join } from 'pathe'

import { addServerHandler, defineNuxtModule } from '@nuxt/kit'
import fs from 'fs-extra'

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
    nuxt.options.build.transpile.push(runtimeDir)

    const clientPath = join(nuxt.options.buildDir, 'trpc-client.ts')
    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')

    addServerHandler({
      route: `${options.trpcURL}/*`,
      handler: handlerPath,
    })

    nuxt.hook('autoImports:extend', (imports) => {
      imports.push(
        { name: 'useClient', from: clientPath },
        { name: 'useAsyncQuery', from: join(runtimeDir, 'client') },
      )
    })

    await fs.ensureDir(dirname(clientPath))

    await fs.writeFile(clientPath, `
      import * as trpc from '@trpc/client'
      import type { router } from '~/server/trpc'

      const client = trpc.createTRPCClient<typeof router>({
        url: '${options.baseURL}${options.trpcURL}',
      })
    
      export const useClient = () => client
    `)

    await fs.writeFile(handlerPath, `
      import { createTRPCHandler } from 'trpc-nuxt/api'
      import * as functions from '~/server/trpc'

      export default createTRPCHandler(functions)
    `)
  },
})

