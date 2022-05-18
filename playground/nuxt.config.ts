import { defineNuxtConfig } from 'nuxt'
import Module from '..'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [Module],
  runtimeConfig: {
    baseURL: 'http://localhost:3000',
  },
  typescript: {
    strict: true,
  },
})
