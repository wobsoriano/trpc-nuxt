export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  modules: ['@nuxtlabs/github-module'],
  extends: process.env.DOCUS_THEME_PATH || '@nuxt-themes/docus',
  github: {
    owner: 'wobsoriano',
    repo: 'trpc-nuxt',
    branch: 'next'
  },
  colorMode: {
    preference: 'dark'
  },
  build: {
    transpile: [/content-edge/, /github-module/]
  }
})
