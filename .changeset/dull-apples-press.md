---
"trpc-nuxt": minor
---

Introduce `useSubscription` composable that provides a reactive interface for tRPC subscriptions.

**Example:**

```vue
<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { status, data, error } = $trpc.todo.onActivity.useSubscription(undefined, {
  onStarted: () => {
    console.log('Subscription started');
  },
  onData: (activity) => {
    console.log('Received activity:', activity);
  },
  onError: (err) => {
    console.error('Subscription error:', err);
  },
  onConnectionStateChange: (state) => {
    console.log('Connection state:', state);
  },
});
</script>

<template>
  <div>
    <p>Status: {{ status }}</p>
    <p v-if="data">Last activity: {{ data }}</p>
  </div>
</template>
```