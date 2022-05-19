<script setup lang="ts">
const { data, pending, error } = await useAsyncQuery(['getUser', { username: 'jcena' }], {
  lazy: true,
})
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error">
    Error: {{ JSON.stringify(error, null, 2) }}
  </div>
  <div v-else>
    User {{ JSON.stringify(data, null, 2) }}
  </div>
</template>
