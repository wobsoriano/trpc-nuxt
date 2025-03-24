import starlight from '@astrojs/starlight';
// @ts-check
import { defineConfig } from 'astro/config';

import starlightThemeFlexoki from 'starlight-theme-flexoki';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      // logo: {
      //   dark: '/src/assets/trpc-nuxt.webp',
      //   light: '/src/assets/trpc-nuxt.webp',
      // },
      plugins: [starlightThemeFlexoki()],
      title: 'tRPC Nuxt',
      social: {
        github: 'https://github.com/wobsoriano/trpc-nuxt',
      },
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/wobsoriano/trpc-nuxt/edit/main/apps/docs/',
      },

      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: '/og.png' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:alt', content: 'End-to-end typesafe APIs in Nuxt applications.' },
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Setup', slug: 'setup' },
          ],
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'References',
          autogenerate: { directory: 'references' },
        },
      ],
    }),
  ],
});
