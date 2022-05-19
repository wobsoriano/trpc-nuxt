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
          error.code === 'BAD_REQUEST'
          && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      }
    }
  })
```

### Usage in Vue

```html
<script setup lang="ts">
const { error } = await useAsyncQuery(['getUser', { id: 69 }])
</script>

<template>
  <pre v-if="error?.data?.zodError">
    {{ JSON.stringify(error.data.zodError, null, 2) }}
  </pre>
</template>
```

Learn more about error formatting [here](https://trpc.io/docs/error-formatting).
