<script setup lang="ts">
const route = useRoute();
const { $client } = useNuxtApp();
const { data: todo, pending, error } = await useAsyncData(() => $client.todo.getTodo.query(Number(route.params.id)));
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error">
    {{ error.message }} - {{ error.cause }}
  </div>
  <div v-else>
    ID: {{ todo?.id }} <br>
    Title: {{ todo?.title }} <br>
    Completed: {{ todo?.completed }}
  </div>
</template>
