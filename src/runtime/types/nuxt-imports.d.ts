// Build-time only. This mirrors the *values* Nuxt auto-imports so the library
// source can compile against `#imports` without bundling Nuxt or h3.
//
// Only declare things Nuxt's generated barrels actually export. `#imports` is
// built from auto-import registrations, which are values, so it is not a source
// of types. Import types from `nuxt/app` / `h3` directly instead, otherwise the
// emitted `.d.mts` ships a specifier that resolves to nothing in a consumer's
// project and silently degrades to `any`. See #255.
declare module '#imports' {
  export const useAsyncData: typeof import('nuxt/app').useAsyncData;
  export const useRequestHeaders: typeof import('nuxt/app').useRequestHeaders;
  export const eventHandler: typeof import('h3').eventHandler;
  export const getRequestURL: typeof import('h3').getRequestURL;
  export const getRequestWebStream: typeof import('h3').getRequestWebStream;
}
