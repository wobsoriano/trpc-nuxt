// Values only. Nuxt generates `#imports` from auto-import registrations, so a type
// imported through it resolves to nothing in a consumer's project.
// @see https://github.com/wobsoriano/trpc-nuxt/issues/255
declare module '#imports' {
  export const useAsyncData: typeof import('nuxt/app').useAsyncData;
  export const useRequestHeaders: typeof import('nuxt/app').useRequestHeaders;
  export const eventHandler: typeof import('h3').eventHandler;
  export const getRequestURL: typeof import('h3').getRequestURL;
  export const getRequestWebStream: typeof import('h3').getRequestWebStream;
}
