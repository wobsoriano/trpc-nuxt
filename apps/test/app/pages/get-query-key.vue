<script setup lang="ts">
import type { inferRouterOutputs } from '@trpc/server';
import { getQueryKey } from 'trpc-nuxt/client';
import type { AppRouter } from '~~/server/trpc/routers';

const { $trpc } = useNuxtApp();

const queryKey = getQueryKey($trpc.getCount);

type RouterOutput = inferRouterOutputs<AppRouter>;

const { data: count } = useNuxtData<RouterOutput['getCount']>(queryKey);
</script>

<template>
  <h1>Count: {{ count }}</h1>
</template>
