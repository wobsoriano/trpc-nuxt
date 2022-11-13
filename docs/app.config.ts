export default defineAppConfig({
  docus: {
    title: 'tRPC Nuxt',
    image: 'https://og-image.vercel.app/tRPC-Nuxt',
    alt: 'tRPC-Nuxt cover',
    url: 'https://trpc-nuxt.vercel.app',
    debug: false,
    aside: {
      level: 1
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.com'
      },
      icons: [
        {
          label: 'NuxtJS',
          href: 'https://nuxtjs.org',
          component: 'IconNuxt'
        }
      ]
    }
  }
})
