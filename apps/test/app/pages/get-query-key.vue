<script setup lang="ts">
import { getQueryKey } from 'trpc-nuxt/client';

const { $trpc } = useNuxtApp();

const queryKey = getQueryKey($trpc.getCount);

const { data: count } = useNuxtData(queryKey);
</script>

<template>
  <h1>Count: {{ count }}</h1>
</template>
