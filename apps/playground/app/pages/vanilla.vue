<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/trpc/routers';
import { TRPCClientError } from '@trpc/client';

const { $client } = useNuxtApp();

type RouterOutput = inferRouterOutputs<AppRouter>;

const loading = ref(false);
// const error = ref<TRPCClientError<AppRouter> | null>(null)
const todos = ref<RouterOutput['todo']['getTodos']>([]);

function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

async function fetchTodos() {
  loading.value = true;
  todos.value = await $client.todo.getTodos.query();
  loading.value = false;
}

onMounted(() => {
  fetchTodos();
});

async function addTodo() {
  const title = Math.random().toString(36).slice(2, 7);

  const newData = {
    id: Date.now(),
    userId: 69,
    title,
    completed: false,
  };

  try {
    const result = await $client.todo.addTodo.mutate(newData);
    if (result) {
      todos.value?.push(result);
    }
  }
  catch (err) {
    if (isTRPCClientError(err)) {
      console.log('trpc error!', err);
    }
  }
}
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
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
    </div>
  </div>
</template>
