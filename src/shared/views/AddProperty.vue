<template>
  <div class="add-property-wrapper">
    <pv-card class="add-property-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-home text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('addProperty.title') }}</h2>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Imagen -->
          <div class="col-12 md:col-4 flex flex-column align-items-center">
            <div class="image-placeholder" @click="selectImage">
              <i class="pi pi-plus text-3xl text-black"></i>
            </div>
            <pv-button :label="t('addProperty.uploadPhoto')" icon="pi pi-image" class="mt-3" severity="info" />
          </div>

          <!-- Formulario -->
          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">{{ t('addProperty.propertyDirection') }}</h3>

            <div class="info-grid">
              <div class="info-item">
                <label class="info-label" for="region">{{ t('addProperty.region') }}</label>
                <pv-input-text id="region" v-model="newProperty.region" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="province">{{ t('addProperty.province') }}</label>
                <pv-input-text id="province" v-model="newProperty.province" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="address">{{ t('addProperty.address') }}</label>
                <pv-input-text id="address" v-model="newProperty.address" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="ubigeo">{{ t('addProperty.ubigeo') }}</label>
                <pv-input-text id="ubigeo" v-model="newProperty.ubigeo" class="info-input" />
              </div>
            </div>

            <!-- Botón hecho -->
            <div class="flex justify-content-end mt-4">
              <pv-button :label="t('addProperty.done')" severity="success" icon="pi pi-check" @click="saveProperty" />
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { Property } from "@/Rental/domain/model/property.entity.js";
import { addProperty } from "@/Rental/infrastructure/property.service.js";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();

const newProperty = ref(new Property({
  id: null,
  ownerId: 1, // o dinámico según el usuario
  address: "",
  ubigeo: "",
  province: "",
  region: "",
  areaM2: 0,
  yearsOld: 0,
  status: "available",
  createdAt: new Date().toISOString(),
  image: "https://picsum.photos/300/200?random=99",
  name: "New Property",
  handoverDate: null,
  progress: 0,
  alerts: [],
  locks: []
}));

async function saveProperty() {
  await addProperty(newProperty.value);
  router.push("/my-properties");
}



function selectImage() {
  alert("Image upload not implemented yet.");
}
</script>


<style scoped>

.add-property-wrapper {
  padding: 2rem;
  padding-left: 260px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}


.add-property-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
  margin-inline: 1rem;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background: #fff;
  border: 2px dashed #b22222;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.text-black { color: #000; }


.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
}

.info-input {
  font-size: 1rem;
  padding: 0.6rem;
}


@media (max-width: 1024px) {
  .info-grid { grid-template-columns: 1fr; gap: 0.9rem; }
  .add-property-card { margin-inline: 0.5rem; border-radius: 12px; }
}
</style>