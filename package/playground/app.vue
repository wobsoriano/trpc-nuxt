<script setup lang="ts">
const { data, error } = await useAsyncQuery(['getUser', { username: 'jcena' }], {
  lazy: true,
})

const client = useClient()
</script>

<template>
  <div>
    <div v-if="data">
      {{ JSON.stringify(data, null, 2) }}
    </div>
    <div v-else-if="error">
      asdx  {{ JSON.stringify(error, null, 2) }}
    </div>
  </div>
</template>
