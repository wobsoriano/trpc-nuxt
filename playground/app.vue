<script setup lang="ts">
const client = useClient()
const data = await client.query('getUser', {
  name: 'roberts',
})
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
