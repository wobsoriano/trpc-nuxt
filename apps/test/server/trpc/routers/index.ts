import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

let count = 0;

// Subscription subscribers
type CounterCallback = (value: number) => void;
const counterSubscribers = new Set<CounterCallback>();

function emitCounter(value: number) {
  counterSubscribers.forEach(callback => callback(value));
}

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}`,
      };
    }),
  getCount: baseProcedure
    .query(() => {
      return count;
    }),
  setCount: baseProcedure
    .input(z.number())
    .mutation(async (opts) => {
      count = opts.input;
      emitCounter(count);
      return count;
    }),
  onCountChange: baseProcedure.subscription(async function* (opts) {
    const queue: number[] = [];
    let resolve: ((value: number) => void) | null = null;

    const callback: CounterCallback = (value) => {
      if (resolve) {
        resolve(value);
        resolve = null;
      }
      else {
        queue.push(value);
      }
    };

    counterSubscribers.add(callback);

    try {
      // Yield initial count
      yield count;

      while (!opts.signal?.aborted) {
        const value = queue.length > 0
          ? queue.shift()!
          : await new Promise<number>((r) => {
              resolve = r;
            });

        yield value;
      }
    }
    finally {
      counterSubscribers.delete(callback);
    }
  }),
  getUserId: baseProcedure
    .query(({ ctx }) => {
      return ctx.userId;
    }),
  postFormData: baseProcedure
    .input(z.instanceof(FormData))
    .mutation(({ input }) => {
      return {
        firstName: input.get('firstName'),
        lastName: input.get('lastName'),
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
