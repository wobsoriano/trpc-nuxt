<script setup lang="ts">
const client = useClient()
const { data, error } = await useAsyncData('random', () => client.query('hello'), {
  server: false,
})
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
