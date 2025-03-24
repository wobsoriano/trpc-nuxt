<script setup lang="ts">
const { $trpc } = useNuxtApp()

const { mutate } = $trpc.postFormData.useMutation()
const result = ref('User')

async function handleSubmit(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement)

  const data = await mutate(formData)
  result.value = `${data?.firstName} ${data?.lastName}`
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
  <h1>Welcome, {{ result }}</h1>
</template>
