export default defineNuxtConfig({
  extends: process.env.DOCUS_THEME_PATH || '@nuxt-themes/docus',
  modules: ['@nuxtlabs/github-module'],
  app: {
    pageTransition: false,
    layoutTransition: false,
  },
  colorMode: {
    preference: 'dark',
  },
  build: {
    transpile: [/content-edge/, /github-module/],
  },
  routeRules: {
    '/': { prerender: true },
  },
  nitro: {
    preset: 'vercel',
  },
  github: {
    owner: 'wobsoriano',
    repo: 'trpc-nuxt',
    branch: 'next',
  },
})
