export default defineAppConfig({
  docus: {
    title: 'tRPC Nuxt',
    image: 'https://og-image.vercel.app/tRPC-Nuxt',
    alt: 'tRPC-Nuxt cover',
    url: 'https://trpc-nuxt.vercel.app',
    debug: false,
    socials: {
      github: 'wobsoriano/trpc-nuxt'
    },
    aside: {
      level: 1
    },
    footer: {
      credits: true,
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
