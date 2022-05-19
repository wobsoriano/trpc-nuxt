<script setup lang="ts">
const route = useRoute()
const { data: todo, pending, error } = await useAsyncQuery(['getTodo', Number(route.params.id)])
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    {{ error.data.code }}
  </div>
  <div v-else>
    ID: {{ todo.id }} <br>
    Title: {{ todo.title }} <br>
    Completed: {{ todo.completed }}
  </div>
</template>
