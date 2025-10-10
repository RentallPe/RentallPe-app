<template>
  <div class="properties-wrapper">
    <pv-card class="new-project-card">
      <template #title>
        <div>
          <h2 class="page-title">{{ t('properties.title') }}</h2>
        </div>
      </template>

      <template #content>
        <div class="grid property-grid">
          <div
              v-for="property in user.properties"
              :key="property.id"
              class="col-12 md:col-6"
          >
            <pv-card class="property-card">
              <template #content>
                <router-link :to="`/property/${property.id}`">
                  <img :src="property.image" alt="" class="property-img" />
                </router-link>
                <h3 class="property-title">{{ property.name }}</h3>
                <p class="property-address">{{ property.address }}</p>
                <p>
                  <strong>{{ t('properties.handoverDate') }}:</strong>
                  {{ property.handoverDate || t('properties.notDefined') }}
                </p>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: property.progress + '%' }"></div>
                </div>
                <p>{{ property.progress }}% {{ t('properties.completed') }}</p>
              </template>
            </pv-card>
          </div>
        </div>

        <div class="flex justify-content-end mt-4">
          <router-link to="/add-property">
            <pv-button :label="t('properties.addProperty')" icon="pi pi-plus" severity="primary" />
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const user = ref({ properties: [] });

onMounted(async () => {
  const res = await fetch("http://localhost:3000/user");
  user.value = await res.json();
});
</script>

<style scoped>
.properties-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #000;
}

.property-card {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
}

.property-img {
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.property-img:hover {
  transform: scale(1.02);
}

.property-title {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #000;
}

.property-address {
  color: #959595;
  margin-bottom: 0.5rem;
}

.progress-bar {
  background: #eee;
  border-radius: 8px;
  height: 8px;
  margin: 0.5rem 0;
}
.progress-fill {
  background: #b22222; /* rojo ladrillo */
  height: 100%;
  border-radius: 8px;
  color: #323232;
}
.property-grid {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}
.p-card{
  background: #ffffff;
}
p{
  color: #111111;
}
</style>