<script setup lang="ts">
const { $client } = useNuxtApp()
const { data: product } = await $client.products.useQuery()

function formatPrice(num: number) {
  return `£ ${num.toFixed(2)}`
}
</script>

<template>
  <div class="product-page">
    <header class="header">
      <h1 class="header-title">
        TRPC-Nuxt Basic Example
      </h1>
    </header>
    <div class="card">
      <div class="card-content">
        <h3 class="card-title">
          {{ product.title }}
        </h3>
        <p class="card-description">
          {{ product.description }}
        </p>
        <p class="card-price">
          {{ formatPrice(product.price) }}
        </p>
        <button class="card-button">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
.product-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.header {
  width: 100%;
  background-color: #41b883;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

.card {
  width: 300px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 16px;

}

.card-image {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 16px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-title {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.card-description {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  font-family: 'Roboto', sans-serif;
}

.card-price {
  margin: 8px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.card-button {
  display: block;
  width: 100%;
  padding: 8px;
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  background-color: #41b883;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card-button:hover {
  background-color: #399d7d;
}
</style>
