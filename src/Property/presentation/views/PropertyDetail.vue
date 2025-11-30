<template>
  <div class="property-detail-wrapper">
    <pv-card class="property-detail-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2 class="m-0 text-black">{{ property?.name }}</h2>
          <div class="flex gap-2">
            <!-- Botón borrar -->
            <pv-button
                icon="pi pi-trash"
                severity="danger"
                class="square-btn"
                @click="deleteProperty"
            />
            <!-- Botón volver -->
            <router-link to="/my-properties">
              <pv-button icon="pi pi-arrow-left" severity="secondary" class="square-btn" />
            </router-link>
          </div>
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

        <!-- Botón para ir a alertas -->
        <div class="flex justify-content-end mt-4">
          <router-link :to="`/alerts`">
            <pv-button label="Ver Alertas" icon="pi pi-bell" severity="info" />
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePropertyStore } from "@/Property/application/property-store.js";

const route = useRoute();
const router = useRouter();
const store = usePropertyStore();

const property = ref(null);
const loading = ref(true);
const error = ref("");

const rawId = route.params.id;
const propId = Number.isNaN(Number(rawId)) ? rawId : Number(rawId);

onMounted(async () => {
  try {
    property.value = await store.fetchPropertyById(propId);
    if (!property.value) throw new Error("Property not found");
  } catch (e) {
    console.error(e);
    error.value = e?.message || "Could not load property";
  } finally {
    loading.value = false;
  }
});

async function deleteProperty() {
  if (!property.value) return;
  if (!confirm("Are you sure you want to delete this property?")) return;

  try {
    await store.deleteProperty(property.value.id);
    router.push("/my-properties");
  } catch (e) {
    console.error(e);
    alert("Failed to delete the property.");
  }
}
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
p {
  color: #111111;
}
</style>