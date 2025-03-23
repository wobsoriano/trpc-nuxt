<script setup lang="ts">
const { $trpc } = useNuxtApp()

const { data: userId } = await $trpc.getUserId.useQuery()
</script>

<template>
  <h1>{{ userId }}</h1>
</template>
