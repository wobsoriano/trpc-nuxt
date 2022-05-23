<script setup lang="ts">
const counter = useCookie('counter')
counter.value = counter.value || Math.round(Math.random() * 1000)
</script>

<template>
  <div>
    <h1> Counter: {{ counter || '-' }}</h1>
    <button @click="counter = null">
      reset
    </button>
    <button @click="counter--">
      -
    </button>
    <button @click="counter++">
      +
    </button>
  </div>
</template>
