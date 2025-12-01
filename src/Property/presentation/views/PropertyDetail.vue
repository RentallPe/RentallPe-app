<template>
  <div class="property-detail-wrapper">
    <pv-card class="property-detail-card">

      <!-- HEADER -->
      <template #title>
        <div class="detail-header">
          <div class="title-group">
            <i class="pi pi-building header-icon"></i>
            <div>
              <h2 class="page-title">{{ property?.name }}</h2>
              <span class="status-badge">Active</span>
            </div>
          </div>

          <div class="flex gap-2">
            <pv-button
                icon="pi pi-trash"
                severity="danger"
                class="square-btn"
                @click="deleteProperty"
            />
            <router-link to="/my-properties">
              <pv-button icon="pi pi-arrow-left" severity="secondary" class="square-btn" />
            </router-link>
          </div>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spin pi-spinner"></i>
          <p>Loading property...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <i class="pi pi-exclamation-triangle"></i>
          <p>{{ error }}</p>
        </div>

        <div v-else class="grid content-grid">
          <!-- Imagen -->
          <div class="col-12 md:col-6">
            <div class="image-wrapper">
              <img :src="property?.image" class="property-img" />
            </div>
          </div>

          <!-- Info -->
          <div class="col-12 md:col-6 info-panel">
            <div class="info-item">
              <span>Address</span>
              <strong>{{ property?.address }}</strong>
            </div>

            <div class="info-item">
              <span>Handover date</span>
              <strong>{{ property?.handoverDate || 'Not defined' }}</strong>
            </div>

            <div class="info-item">
              <span>Progress</span>
              <strong>{{ property?.progress }}%</strong>
            </div>

            <div class="progress-wrapper">
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: property?.progress + '%' }"
                ></div>
              </div>
            </div>

            <router-link to="/alerts" class="alerts-btn">
              <pv-button label="View Alerts" icon="pi pi-bell" severity="info" />
            </router-link>
          </div>
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
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

/* Card */

.property-detail-card {
  width: 100%;
  max-width: 950px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Header */

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.2rem;
  color: #44de6f;
}

.page-title {
  margin: 0;
  font-weight: 700;
  color: #111827;
  font-size: 1.7rem;
}

.status-badge {
  display: inline-block;
  margin-top: 0.2rem;
  background: #16a34a;
  color: #fff;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* States */

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.error-state {
  color: #dc2626;
}

/* Grid */

.content-grid {
  margin-top: 1rem;
}

/* Image */

.image-wrapper {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
}

.property-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

/* Info Panel */

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding-left: 1rem;
}

.info-item span {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.1rem;
}

.info-item strong {
  font-size: 1rem;
  color: #111827;
}

/* Progress */

.progress-wrapper {
  margin-top: 0.5rem;
}

.progress-bar {
  background: #e5e7eb;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  transition: width 0.4s ease;
}

/* Buttons */

.square-btn {
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 10px;
}

.alerts-btn {
  margin-top: 1.5rem;
  align-self: flex-end;
}

/* Responsive */

@media (max-width: 768px) {
  .info-panel {
    padding-left: 0;
  }

  .property-img {
    height: 240px;
  }
}
</style>
