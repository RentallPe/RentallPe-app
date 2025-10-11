<template>
  <section class="flex flex-col items-center justify-center h-screen text-center px-4">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <p class="text-xl mb-6">{{ $t('notFound.message') }}</p>
    <router-link to="/" class="pv-button">
      {{ $t('buttons.goHome') }}
    </router-link>
  </section>
</template>

<script setup>
</script>

<style scoped>
.pv-button {
  background-color: #eeeeee;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
}
.pv-button:hover {
  background-color:#eeeeee ;
}
</style>