import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const TodoShape = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof TodoShape>;

interface Activity {
  type: 'added' | 'toggled';
  todo: Todo;
}

// In-memory storage
const todos: Todo[] = [
  { id: 1, title: 'Learn tRPC', completed: false },
  { id: 2, title: 'Build something cool', completed: false },
];

// Use a Set of callbacks instead of EventEmitter
type ActivityCallback = (activity: Activity) => void;
const activitySubscribers = new Set<ActivityCallback>();

function emitActivity(activity: Activity) {
  activitySubscribers.forEach(callback => callback(activity));
}

export const todoRouter = router({
  list: publicProcedure.query(() => todos),

  add: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ input }) => {
      const todo: Todo = {
        id: Date.now(),
        title: input.title,
        completed: false,
      };
      todos.push(todo);
      emitActivity({ type: 'added', todo });
      return todo;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const todo = todos.find(t => t.id === input.id);
      if (todo) {
        todo.completed = !todo.completed;
        emitActivity({ type: 'toggled', todo });
        return todo;
      }
      throw new Error('Todo not found');
    }),

  onCounter: publicProcedure.subscription(async function* (opts) {
    let i = 0;
    while (!opts.signal?.aborted) {
      yield { count: i++ };
      await new Promise(r => setTimeout(r, 1000));
    }
  }),

  onActivity: publicProcedure.subscription(async function* (opts) {
    const queue: Activity[] = [];
    let resolve: ((value: Activity) => void) | null = null;

    const callback: ActivityCallback = (activity) => {
      if (resolve) {
        resolve(activity);
        resolve = null;
      }
      else {
        queue.push(activity);
      }
    };

    activitySubscribers.add(callback);

    try {
      while (!opts.signal?.aborted) {
        const activity = queue.length > 0
          ? queue.shift()!
          : await new Promise<Activity>((r) => {
              resolve = r;
            });

        yield activity;
      }
    }
    finally {
      activitySubscribers.delete(callback);
    }
  }),
});
