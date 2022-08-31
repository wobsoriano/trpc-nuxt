<script setup lang="ts">
const client = useClient()
const headers = useClientHeaders()
const { data: todos, pending, error, refresh } = await useAsyncQuery(['getTodos'])

const addHeader = () => {
  headers.value.authorization = 'Bearer abcdefghijklmnop'
  console.log(headers.value)
}

const addTodo = async () => {
  const title = Math.random().toString(36).slice(2, 7)

  try {
    const result = await client.mutation('addTodo', {
      id: Date.now(),
      userId: 69,
      title,
      completed: false,
    })
    console.log('Todo: ', result)
  }
  catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    Error: {{ error.data.code }}
  </div>
  <div v-else-if="todos">
    <ul>
      <li v-for="t in todos.slice(0, 10)" :key="t.id">
        <NuxtLink :class="{ completed: t.completed }" :to="`/todo/${t.id}`">
          Title: {{ t.title }}
        </NuxtLink>
      </li>
    </ul>
    <button @click="addTodo">
      Add Todo
    </button>
    <button @click="() => refresh()">
      Refresh
    </button>
    <button @click="addHeader">
      Add header
    </button>
  </div>
</template>

<style>
a {
  text-decoration: none;
}

.completed {
  text-decoration: line-through;
}
</style>
