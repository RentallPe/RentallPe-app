<template>
  <div class="property-detail-wrapper">
    <pv-card class="property-detail-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2 class="m-0 text-black">{{ property?.name }}</h2>
          <!-- Botón cuadrado para volver -->
          <router-link to="/my-properties">
            <pv-button icon="pi pi-arrow-left" severity="secondary" class="square-btn" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Columna 1: Imagen -->
          <div class="col-12 md:col-6">
            <img :src="property?.image" alt="" class="property-img" />
          </div>

          <!-- Columna 2: Info -->
          <div class="col-12 md:col-6">
            <p><strong>Address:</strong> {{ property?.address }}</p>
            <p><strong>Handover date:</strong> {{ property?.handoverDate || 'Not defined' }}</p>
            <p><strong>Progress:</strong> {{ property?.progress }}%</p>

            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: property?.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const property = ref(null);

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/user`);
  const user = await res.json();
  property.value = user.properties.find(p => p.id === parseInt(route.params.id));
});
</script>

<style scoped>
.property-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: #f9fafb;
  min-height: 100vh;
}
.property-detail-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
}
.property-img {
  width: 100%;
  border-radius: 12px;
}
.square-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  background-color: #f76c6c;
}
.progress-bar {
  background: #eee;
  border-radius: 8px;
  height: 8px;
  margin: 0.5rem 0;
}
.progress-fill {
  background: #b22222;
  height: 100%;
  border-radius: 8px;
}
p{
  color: #111111;
}
.p-card {
  color: #111111;
}
</style>