// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt'],
  },
  // Temporary fix. See https://github.com/nuxt/nuxt/discussions/27779#discussioncomment-9952440
  vite: {
    server: {
      hmr: {
        clientPort: 3000,
      },
    },
  },
})
