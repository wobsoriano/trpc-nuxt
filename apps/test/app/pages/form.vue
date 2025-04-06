<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data, mutate } = $trpc.postFormData.useMutation();

function handleSubmit(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement);

  mutate(formData);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="firstName" value="John">
    <input type="text" name="lastName" value="Doe">
    <button type="submit">
      Submit
    </button>
  </form>
  <h1 v-if="data">
    Welcome, {{ data.firstName }} {{ data.lastName }}
  </h1>
  <h1 v-else>
    Welcome, Guest
  </h1>
</template>
