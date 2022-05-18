<script setup lang="ts">
const client = useClient()
const { data, error } = await useAsyncData('getUser', () => client.query('getUser', {
  username: 'asd',
}), {
  server: true,
})

watchEffect(() => {
  console.log(process.server, error.value)
})
</script>

<template>
  <div>
    {{ error }}
  </div>
</template>
