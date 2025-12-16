<script setup lang="ts">
const { $trpc } = useNuxtApp();

const receivedValues = ref<number[]>([]);

const { status, data } = $trpc.onCountChange.useSubscription(undefined, {
  onData: (value) => {
    receivedValues.value.push(value);
  },
});

// Trigger a count change
const { mutate: setCount } = $trpc.setCount.useMutation();

let currentCount = 0;
function incrementCount() {
  currentCount++;
  setCount(currentCount);
}
</script>

<template>
  <div>
    <h1>Subscription Test</h1>
    <p>Status: {{ status }}</p>
    <p>Last value: {{ data ?? 'N/A' }}</p>
    <p>Received values: {{ receivedValues.join(', ') }}</p>
    <button @click="incrementCount">
      Increment Count
    </button>
  </div>
</template>
