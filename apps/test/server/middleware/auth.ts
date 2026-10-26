import { defineEventHandler } from 'nuxt/server';

export default defineEventHandler((event) => {
  event.context.auth = {
    userId: 'abc_123',
  };
});

declare module 'nuxt/schema' {
  interface RequestEventContext {
    auth: { userId: string };
  }
}
