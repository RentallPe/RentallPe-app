<template>
  <div class="not-found-wrapper">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <router-link to="/dashboard">
      <pv-button label="Volver al inicio" icon="pi pi-home" />
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f9fafb;
  color: #333;
}
h1 {
  font-size: 5rem;
  margin: 0;
  color: #f76c6c;
}
h2 {
  margin-bottom: 2rem;
}
</style>