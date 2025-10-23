<script setup lang="ts">
const { $client } = useNuxtApp();

async function handleSubmit(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement);
  console.log('formdata client', formData.get('name'));
  const result = await $client.user.hello.mutate(formData);
  console.log('Result:', result);
}
</script>

<template>
  <form
    method="POST"
    encType="multipart/form-data"
    action="/api/trpc/user.hello"
    @submit.prevent="handleSubmit"
  >
    <input
      type="text"
      name="name"
      placeholder="Name"
      value="Rob"
    >
    <button type="submit">
      Submit
    </button>
  </form>
</template>
