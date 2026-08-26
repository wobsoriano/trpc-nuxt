---
"trpc-nuxt": patch
---

Keep h3 external in the Nitro build so that Nitro's H3Event augmentation applies correctly ([#261](https://github.com/wobsoriano/trpc-nuxt/pull/261)). Previously, h3's H3Event was being inlined instead of imported, causing type checking failures when typing `createContext` against h3 (missing properties on H3Event).
