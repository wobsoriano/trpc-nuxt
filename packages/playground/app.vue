<script setup lang="ts">
const { data, error } = useTrpcQuery('hello')

// const d = useLazyAsyncData('asd', () => $fetch('/api/hello'))

watch(data, (val) => {
  console.log('val', val)
  console.log('error', error.value)
}, {
  immediate: true,
})
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
