export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false,
  },
  extends: '@nuxt-themes/docus',
  build: {
    transpile: [/content-edge/],
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
    preset: 'vercel',
  },
})
