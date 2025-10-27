<template>
  <div class="not-found-wrapper">
    <pv-card class="not-found-card shadow-3">
      <template #title>
        <div class="flex align-items-center justify-content-center gap-2 mb-2">
          <i class="pi pi-exclamation-triangle text-primary text-3xl"></i>
          <h2 class="m-0 text-black">404 - {{ t('notFound.title') }}</h2>
        </div>
      </template>

      <template #content>
        <div class="text-center not-found-content">
          <h1 class="text-7xl font-bold text-primary mb-3">404</h1>
          <p class="text-xl mb-6 text-gray-600">
            {{ t('notFound.message') || 'La página que buscas no existe o fue movida.' }}
          </p>

          <router-link to="/dashboard" class="pv-button">
            <i class="pi pi-home mr-2"></i>
            {{ t('buttons.goHome') || 'Volver al inicio' }}
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
}

.not-found-card {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  padding: 2rem 1.5rem;
}

.not-found-content h1 {
  color: #b22222;
}

.pv-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #b22222;
  color: white;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pv-button:hover {
  background-color: #861919;
  transform: scale(1.03);
}

.text-gray-600 {
  color: #6b7280;
}
</style>