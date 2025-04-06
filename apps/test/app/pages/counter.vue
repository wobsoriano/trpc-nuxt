<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data: count, refresh } = await $trpc.getCount.useQuery();
const { mutate } = $trpc.setCount.useMutation();

async function setCount() {
  await mutate(Number(count.value) + 1);
  refresh();
}
</script>

<template>
  <h1>Count: {{ count }}</h1>
  <button @click="setCount">
    Update
  </button>
  <NuxtLink to="/get-query-key">
    Go to query key
  </NuxtLink>
</template>
