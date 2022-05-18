import { dirname, join } from 'pathe'

import { addServerHandler, defineNuxtModule } from '@nuxt/kit'
import fs from 'fs-extra'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'trpc-nuxt',
    configKey: 'trpc',
  },
  defaults: {},
  async setup(_options, nuxt) {
    const clientPath = join(nuxt.options.buildDir, 'trpc-client.ts')
    const handlerPath = join(nuxt.options.buildDir, 'trpc-handler.ts')

    addServerHandler({
      route: '/trpc/*',
      handler: handlerPath,
    })

    nuxt.hook('autoImports:extend', (imports) => {
      imports.push(
        { name: 'useClient', from: clientPath },
      )
    })

    await fs.ensureDir(dirname(clientPath))

    await fs.writeFile(clientPath, `
      import * as trpc from '@trpc/client'
      import type { router } from '~/server/trpc'

      const client = trpc.createTRPCClient<typeof router>({
        url: process.browser ? '/trpc' : 'http://localhost:3000/trpc',
      })
    
      const useClient = () => client

      export {
        useClient
      }
    `)

    await fs.writeFile(handlerPath, `
      import { createTRPCHandler } from 'trpc-nuxt/api'
      import * as functions from '~/server/trpc'

      export default createTRPCHandler({
        router: functions.router,
        createContext: functions.createContext ?? undefined,
        responseMeta: functions.responseMeta ?? undefined,
      })
    `)
  },
})

