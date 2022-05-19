# Merging Routers

Writing all API-code in your code in the same file is not a great idea. It's easy to merge routers with other routers.

```ts
// ~/server/trpc/routes/posts.ts
export const posts = trpc.router()
  .mutation('create', {
    input: z.object({
      title: z.string(),
    }),
    resolve: ({ input }) => {
      // ..
      return {
        id: 'xxxx',
        ...input,
      }
    },
  })
  .query('list', {
    resolve() {
      // ..
      return []
    }
  })
```

```ts
// ~/server/trpc/routes/users.ts
export const users = trpc.router()
  .query('list', {
    resolve() {
      // ..
      return []
    }
  })
```

```ts
// ~/server/trpc/index.ts
import { users } from './routes/users'
import { posts } from './routes/posts'

export const router = trpc.router()
  .merge('user.', users) // prefix user procedures with "user."
  .merge('post.', posts) // prefix post procedures with "post."
```
