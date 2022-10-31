import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '@/server/trpc/routers'
import { createContext } from '@/server/trpc/context'

export default createNuxtApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
})
