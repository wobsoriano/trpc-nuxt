<script setup lang="ts">
const { $client } = useNuxtApp()

const addTodo = async () => {
  const title = Math.random().toString(36).slice(2, 7)

  try {
    const x = await $client.todo.addTodo.mutate({
      id: Date.now(),
      userId: 69,
      title,
      completed: false
    })
    console.log(x)
  } catch (e) {
    console.log(e)
  }
}

const { data: todos, pending, error, refresh } = await $client.todo.getTodos.useQuery()
</script>

<template>
  <div>
    <div v-if="pending">
      Loading...
    </div>
    <div v-else-if="error?.data?.code">
      Error: {{ error.data.code }}
    </div>
    <div v-else>
      <ul>
        <li
          v-for="t in todos?.slice(0, 10)"
          :key="t.id"
        >
          <NuxtLink
            :class="{ completed: t.completed }"
            :to="`/todo/${t.id}`"
          >
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
    </div>
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
