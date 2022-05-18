<script setup lang="ts">
const client = useClient()
const { data, refresh } = await useAsyncData('getUser', () => client.query('getUsers'), {
  server: true,
})

const addUser = async (username: string) => {
  try {
    await client.mutation('createUser', {
      username,
    })
    refresh()
    console.log('user added')
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    {{ data }}
  </div>
  <button @click="addUser('marksx')">
    add
  </button>
</template>
