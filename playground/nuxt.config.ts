import { defineNuxtConfig } from 'nuxt/config'
import superjson from 'superjson'
import Module from '../src/module'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [Module],
  runtimeConfig: {
    baseURL: '',
    public: {
      trpc: {
        transformer: superjson,
      },
    },
  },
  typescript: {
    strict: true,
  },
})
