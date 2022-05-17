<script setup lang="ts">
const { data, error } = await useTrpcQuery('getUser', {
  name: 'john',
})

watchEffect(() => {
  console.log(data.value)
  console.log('err', error.value)
})
</script>

<template>
  <div>hello</div>
</template>
