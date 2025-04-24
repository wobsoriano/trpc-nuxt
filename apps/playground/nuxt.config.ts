// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt'],
  },
  devtools: {
    enabled: false,
  },
  compatibilityDate: '2025-03-13',
});
