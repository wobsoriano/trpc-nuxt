<script setup lang="ts">
const { $trpc } = useNuxtApp();

const hello = await $trpc.hello.query({ text: 'client' });
</script>

<template>
  <h1>{{ hello.greeting }}</h1>
</template>
