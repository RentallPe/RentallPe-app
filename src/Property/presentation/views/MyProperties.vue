<script setup>
import { onMounted, computed } from "vue";
import { usePropertyStore } from "@/Property/application/property-store.js";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = usePropertyStore();

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const properties = computed(() => {
  if (!currentUser?.id) return [];
  return store.properties
      .filter(p => String(p.ownerId) === String(currentUser.id)) // 👈 filtra por el id del usuario logueado
      .map(p => ({
        ...p,
        image: p.image || `https://picsum.photos/800/600?random=${p.id ?? Math.random()}`,
        name: p.name ?? "New Property",
        address: p.address ?? "—",
        province: p.province ?? "—",
        region: p.region ?? "—",
        status: p.status ?? "—",
        handoverDate: p.handoverDate ?? "Not defined",
        progress: Number.isFinite(p.progress) ? p.progress : 0
      }));
});

onMounted(async () => {
  await store.fetchProperties();
});
</script>



<template>
  <div class="properties-wrapper">
    <pv-card class="new-project-card">
      <template #title>
        <div class="header">
          <div class="title-group">
            <i class="pi pi-home header-icon"></i>
            <div>
              <h2 class="page-title">{{ t('properties.title') }}</h2>
              <p class="page-subtitle">{{ t('properties.subtitle') }}</p>
            </div>
          </div>

          <router-link to="/add-property">
            <pv-button :label="t('properties.addProperty')" icon="pi pi-plus" severity="primary" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div v-if="properties.length === 0" class="empty-state">
          <i class="pi pi-building empty-icon"></i>
          <p>{{ t('properties.noProperties') }}</p>
        </div>

        <div v-else class="grid property-grid grid-reset">
          <div
              v-for="property in properties"
              :key="property.id"
              class="col-12 md:col-6 lg:col-4 col-fix"
          >
            <pv-card class="property-card">
              <template #header>
                <router-link :to="`/property/${property.id}`">
                  <div class="image-wrapper">
                    <img :src="property.image" class="property-img" />
                    <span class="status-badge">{{ property.status }}</span>
                  </div>
                </router-link>
              </template>

              <template #content>
                <h3 class="property-title">{{ property.name }}</h3>
                <p class="property-address">{{ property.address }}</p>

                <div class="property-info">
                  <span><strong>{{ t('properties.province') }}:</strong> {{ property.province }}</span>
                  <span><strong>{{ t('properties.region') }}:</strong> {{ property.region }}</span>
                  <span><strong>{{ t('properties.handover') }}:</strong> {{ property.handoverDate }}</span>
                </div>

                <div class="progress-wrapper">
                  <div class="progress-text">
                    {{ property.progress }}% {{ t('properties.completed') }}
                  </div>
                  <div class="progress-bar">
                    <div
                        class="progress-fill"
                        :style="{ width: property.progress + '%' }"
                    ></div>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>


<style scoped>
.properties-wrapper {
  --sbw: 260px;
  margin-left: var(--sbw);
  width: calc(100% - var(--sbw));
  padding: 2rem;
  min-height: 100dvh;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.new-project-card {
  width: 100%;
  max-width: 1100px;
  margin: auto;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* Header */

.header {
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
  font-size: 1.8rem;
}

.page-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Empty */

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Grid */

.grid-reset {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.grid-reset > [class*="col-"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.col-fix {
  min-width: 0;
}

/* Cards */

.property-card {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.25s ease;
  border: 1px solid #e5e7eb;
}

.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  position: relative;
}

.property-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

/* Badge */

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-weight: 600;
}

/* Content */

.property-title {
  margin: 0.25rem 0 0;
  font-weight: 700;
  color: #111827;
}

.property-address {
  color: #6b7280;
  margin: 0.25rem 0 0.5rem;
  font-size: 0.9rem;
}

.property-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #374151;
}

/* Progress */

.progress-wrapper {
  margin-top: 0.75rem;
}

.progress-text {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  color: #374151;
}

.progress-bar {
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
}

/* Responsive */

@media (max-width: 1024px) {
  .properties-wrapper {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
}
</style>

