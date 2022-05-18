import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // if (process.server) {
  //   nuxtApp.hooks.hook('app:rendered', () => {
  //     nuxtApp.ssrContext['']
  //   })
  // }

  // if (process.client) {
  //   nuxtApp.hooks.hook('app:created', () => {
  //     console.log('app:created')
  //   })
  // }
  if (nuxtApp.ssrContext)
    console.log('hello', nuxtApp.ssrContext)
})
