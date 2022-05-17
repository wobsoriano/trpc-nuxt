<script setup lang="ts">
const { data, pending } = useLazyTrpcQuery('getUser', {
  name: 'roberts',
})

watchEffect(() => {
  console.log(data.value)
})
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else>
    {{ data }}
  </div>
</template>
