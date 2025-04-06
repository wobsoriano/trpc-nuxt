<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/routers';
import { getMutationKey, getQueryKey } from 'trpc-nuxt/client';

const { $client } = useNuxtApp();

type RouterOutput = inferRouterOutputs<AppRouter>;

const todosKey = getQueryKey($client.todo.getTodos, undefined);
const { data } = useNuxtData<RouterOutput['todo']['getTodos']>(todosKey);

const { data: todos, pending, error, refresh } = await $client.todo.getTodos.useQuery();

const { mutate, error: someError } = $client.todo.addTodo.useMutation();

const mutationKey = getMutationKey($client.todo.addTodo);
const { data: mutationData } = useNuxtData(mutationKey);

async function addTodo() {
  const title = Math.random().toString(36).slice(2, 7);

  const newData = {
    id: Date.now(),
    userId: 69,
    title,
    completed: false,
  };

  const result = await mutate(newData);
  if (result) {
    data.value?.push(result);
  }

  console.log('mutationData', toRaw(mutationData.value));
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
