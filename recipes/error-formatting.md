## Error Formatting

The error formatting in your router will be inferred all the way to your client (& Vue components).

### Adding custom formatting

```ts
// ~/server/trpc/index.ts
import * as trpc from '@trpc/server'

export const router = trpc.router<Context>()
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_USER_INPUT'
          && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      }
    }
  })
```

### Usage in Vue

```html

```
