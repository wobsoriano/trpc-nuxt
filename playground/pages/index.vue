<script setup lang="ts">
const { data: todos, pending, error, refresh } = await useAsyncQuery(['getTodos'])
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    Error: {{ error.data.code }}
  </div>
  <div v-else>
    <ul>
      <li v-for="t in todos.slice(0, 10)" :key="t.id">
        <NuxtLink :class="{ completed: t.completed }" :to="`/todo/${t.id}`">
          Title: {{ t.title }}
        </NuxtLink>
      </li>
    </ul>
    <button @click="() => refresh()">
      Refresh
    </button>
  </div>
</template>

<style>
a {
  text-decoration: none;
}

.completed {
  text-decoration: line-through;
}
</style>
