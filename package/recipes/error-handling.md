## Handling errors

All errors that occur in a procedure go through the `onError` method before being sent to the client. Here you can handle or change errors.

```ts
// ~/server/trpc/index.ts
import * as trpc from '@trpc/server'

export function onError({ error, type, path, input, ctx, req }) {
  console.error('Error:', error)
  if (error.code === 'INTERNAL_SERVER_ERROR') {
    // send to bug reporting
  }
}
```
