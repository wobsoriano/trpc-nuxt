---
title: Mutation & Revalidation
description: Set up with Nuxt.
---

The example below shows how you can use Nuxt's [`useNuxtData`](https://nuxt.com/docs/api/composables/use-nuxt-data#optimistic-updates) to update the UI after a mutation:

```vue
<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data } = await $trpc.getTodos.useQuery(undefined);
</script>
```

```vue
<script setup lang="ts">
import { getQueryKey } from 'trpc-nuxt/client';

const { $trpc } = useNuxtApp();
const previousTodos = ref([]);

const queryKey = getQueryKey($trpc.getTodos, undefined);

// Access to the cached value of useQuery in todos.vue
const { data: todos } = useNuxtData(queryKey);

async function addTodo(payload) {
  // Store the previously cached value to restore if mutation fails.
  previousTodos.value = todos.value;

  // Optimistically update the todos.
  todos.value.push(payload);

  try {
    await $trpc.addTodo.mutate(payload);
    // Invalidate todos in the background if the mutation succeeded.
    await refreshNuxtData(queryKey);
  }
  catch {
    // Rollback the data if the mutation failed.
    todos.value = previousTodos.value;
  }
}
</script>
```
