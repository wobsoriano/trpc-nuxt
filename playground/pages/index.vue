<script setup lang="ts">
import { TRPCClientError } from '@trpc/client';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/trpc/routers';

const { $client } = useNuxtApp()
// const headers = useClientHeaders()

// const addHeader = () => {
//   headers.value.authorization = 'Bearer abcdefghijklmnop'
//   console.log(headers.value)
// }

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

type RouterOutput = inferRouterOutputs<AppRouter>;
type ErrorOutput = TRPCClientError<AppRouter>

const { data: todos, pending, error, refresh } = await useAsyncData<RouterOutput['todo']['getTodos'], ErrorOutput>(() => $client.todo.getTodos.query())
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
        <li v-for="t in todos?.slice(0, 10)" :key="t.id">
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
