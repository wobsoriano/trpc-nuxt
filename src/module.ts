import { defineNuxtModule, addTemplate, addServerHandler } from '@nuxt/kit'
import fg from 'fast-glob'
import { resolve } from 'pathe'
import dedent from 'dedent'

export interface ModuleOptions {
  enableFileRouting: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'trpc-nuxt',
    configKey: 'trpc',
    compatibility: {
      nuxt: '^3.0.0-rc.13'
    }
  },
  defaults: {
    enableFileRouting: true
  },
  async setup (moduleOptions, nuxt) {
    nuxt.options.build.transpile.push('trpc-nuxt')
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || []
    nuxt.options.vite.optimizeDeps.exclude.push('trpc-nuxt/client', 'trpc-nuxt/handler')

    if (!moduleOptions.enableFileRouting) {
      return
    }

    const files: string[] = []
    const dirs = [
      resolve(nuxt.options.rootDir, 'server/trpc/routers')
    ]
    const extGlob = '*.{ts,js}'

    async function scanServerFunctions () {
      files.length = 0
      files.push(...new Set(
        (await Promise.all(
          dirs.map(dir => fg(extGlob, { cwd: dir, absolute: true, onlyFiles: true })))
        ).flat()
      ))
      return files
    }

    nuxt.hook('builder:watch', async (e, path) => {
      if (e === 'change') {
        return
      }
      const abs = resolve(nuxt.options.rootDir, path)
      if (files.includes(abs) || dirs.some(dir => abs.startsWith(dir))) {
        await scanServerFunctions()
        await nuxt.callHook('builder:generateApp')
      }
    })

    function getRouteName (routePath: string) {
      const pathSplit = routePath.split('/')
      return pathSplit[pathSplit.length - 1]
    }

    addTemplate({
      filename: 'trpc/init.mjs',
      write: true,
      getContents () {
        return dedent`
          import { initTRPC } from '@trpc/server'
          import superjson from 'superjson'

          const t = initTRPC.context().create({
            transformer: superjson,
          })

          export const router = t.router
          export const defineRouter = router
          export const publicProcedure = t.procedure
          export const middleware = t.middleware
          export const mergeRouters = t.mergeRouters
        `
      }
    })

    addTemplate({
      filename: 'trpc/types.d.ts',
      write: true,
      getContents () {
        const initFile = resolve(nuxt.options.buildDir, 'trpc/init.mjs')
        return dedent`
          declare module '#trpc/init' {
            const router: typeof import('${initFile}').router
            const defineRouter: typeof import('${initFile}').defineRouter
            const publicProcedure: typeof import('${initFile}').publicProcedure
            const middleware: typeof import('${initFile}').middleware
            const mergeRouters: typeof import('${initFile}').mergeRouters
          }
        `
      }
    })

    addTemplate({
      filename: 'trpc/handler.ts',
      write: true,
      getContents () {
        const routeFiles = files.map(i => i.replace(/\.ts$/, ''))
        return dedent`
          import { createNuxtApiHandler } from 'trpc-nuxt/handler'
          import { router } from '${resolve(nuxt.options.buildDir, 'trpc/init.mjs')}'
          ${routeFiles.map(i => `import { default as ${getRouteName(i)}Route } from '${i}'`).join('\n')}

          export const appRouter = router({
            ${routeFiles.map(i => `${getRouteName(i)}: ${getRouteName(i)}Route`).join(',\n')}
          })
          
          export type AppRouter = typeof appRouter
    
          export default createNuxtApiHandler({
            router: appRouter
          })
        `
      }
    })

    addServerHandler({
      route: '/api/trpc/:trpc',
      handler: resolve(nuxt.options.buildDir, 'trpc/handler.ts'),
      lazy: true
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#trpc/init'] = resolve(nuxt.options.buildDir, 'trpc/init.mjs')
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'trpc/types.d.ts') })
    })

    await scanServerFunctions()
  }
})
