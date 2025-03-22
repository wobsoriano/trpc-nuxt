<script setup lang="ts">
const route = useRoute()
const { $client } = useNuxtApp()
const id = ref(1)
// const { data: todo, pending, error } = await useAsyncData(() => $client.todo.getTodo.query(id.value), {
//   watch: [id]
// })

const { data: todo, pending, error, refresh } = await $client.todo.getTodo.useQuery(id)
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    Error: {{ error.data.code }}
  </div>
  <div v-else>
    ID: {{ todo?.id }} <br>
    Title: {{ todo?.title }} <br>
    Completed: {{ todo?.completed }}
  </div>
  <button @click="id++">
    Next Todo
  </button>
</template>
