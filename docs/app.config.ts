export default defineAppConfig({
  docus: {
    title: 'tRPC Nuxt',
    description: 'End-to-end typesafe APIs in Nuxt applications.',
    image: 'https://og-image.vercel.app/tRPC-Nuxt',
    alt: 'tRPC-Nuxt cover',
    url: 'https://trpc-nuxt.vercel.app',
    debug: false,
    socials: {
      github: 'wobsoriano/trpc-nuxt',
    },
    cover: {
      src: '/cover.jpg',
      alt: 'tRPC-Nuxt module',
    },
    header: {
      logo: true,
    },
    aside: {
      level: 1,
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.com',
      },
      iconLinks: [
        {
          label: 'NuxtJS',
          href: 'https://nuxt.com',
          // @ts-expect-error: IDK nuxt
          component: 'IconNuxtLabs',
        },
      ],
    },
  },
})
