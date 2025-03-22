import starlight from '@astrojs/starlight'
// @ts-check
import { defineConfig } from 'astro/config'
import starlightThemeFlexoki from 'starlight-theme-flexoki'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightThemeFlexoki()],
      title: 'tRPC Nuxt',
      social: {
        github: 'https://github.com/wobsoriano/trpc-nuxt',
      },
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
})
