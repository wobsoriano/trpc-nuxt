<script setup lang="ts">
const client = useClient()

const key = 'getUser'

const { data, pending, error } = await useTRPCAsyncData(key, () => client.query(key, {
  username: 'jcena',
}))
</script>

<template>
  <div>
    <div v-if="data">
      {{ JSON.stringify(data, null, 2) }}
    </div>
    <div v-else-if="error">
      asdx  {{ JSON.stringify(error.data, null, 2) }}
    </div>
  </div>
</template>
