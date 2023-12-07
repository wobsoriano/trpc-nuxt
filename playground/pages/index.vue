<script setup lang="ts">
import { getQueryKey } from 'trpc-nuxt/client'

const { $client } = useNuxtApp()

const todosKey = getQueryKey($client.todo.getTodos, undefined)
const { data } = useNuxtData(todosKey)

const { data: todos, pending, error, refresh } = await $client.todo.getTodos.useQuery()

const { mutate } = $client.todo.addTodo.useMutation()

const addTodo = async () => {
  const title = Math.random().toString(36).slice(2, 7)

  const newData = {
    id: Date.now(),
    userId: 69,
    title,
    completed: false
  }

  const result = await mutate(newData)

  data.value.push(result)
}
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
          v-for="t in todos"
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
