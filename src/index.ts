import { createTRPCNuxtHandler as _createTRPCNuxtHandler, createNuxtApiHandler } from './server';

/**
 * @deprecated Use `createTRPCNuxtHandler` from `trpc-nuxt/server` instead. This will be removed in the next minor version.
 */
const createTRPCNuxtHandler = _createTRPCNuxtHandler;

export {
  createNuxtApiHandler,
  createTRPCNuxtHandler,
};
