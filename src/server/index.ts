import { createTRPCNuxtHandler } from './create-trpc-nuxt-handler';

export { createTRPCNuxtHandler };

/**
 * @deprecated Use createTRPCNuxtHandler instead. This will be removed in the next minor version.
 */
export const createNuxtApiHandler = createTRPCNuxtHandler;
