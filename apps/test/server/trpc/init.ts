import type { H3Event } from 'h3';
import { initTRPC } from '@trpc/server';
import { superjson } from '~/shared/superjson';

export async function createTRPCContext(event: H3Event) {
  const { userId } = event.context.auth
  return { userId };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
