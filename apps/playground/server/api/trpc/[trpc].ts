import { createTRPCNuxtHandler } from 'trpc-nuxt/server';
import { createContext } from '../../trpc/context';
import { appRouter } from '../../trpc/routers';

export default createTRPCNuxtHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
