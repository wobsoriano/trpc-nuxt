<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/trpc/routers';
import { getQueryKey } from 'trpc-nuxt/client';

const { $trpc } = useNuxtApp();

const queryKey = getQueryKey($trpc.getCount);

type RouterOutput = inferRouterOutputs<AppRouter>;

const { data: count } = useNuxtData<RouterOutput['getCount']>(queryKey);
</script>

<template>
  <h1>Count: {{ count }}</h1>
</template>
