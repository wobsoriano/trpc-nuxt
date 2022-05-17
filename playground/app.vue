<script setup lang="ts">
const { data, error } = await useTrpcQuery('getUser', {
  name: 'johns',
})

watchEffect(() => {
  console.log(data.value)
  console.log('err', error.value)
})
</script>

<template>
  <div>{{ data.name }}</div>
</template>
