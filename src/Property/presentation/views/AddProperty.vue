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
            <h3 class="text-black mb-3">{{ t('addProperty.propertyInformation') }}</h3>

            <div class="info-grid">
              <!-- Nombre -->
              <div class="info-item">
                <label class="info-label" for="name">{{ t('addProperty.name') }}</label>
                <pv-input-text id="name" v-model="newProperty.name" class="info-input" />
              </div>

              <!-- Dirección -->
              <div class="info-item">
                <label class="info-label" for="address">{{ t('addProperty.address') }}</label>
                <pv-input-text id="address" v-model="newProperty.address" class="info-input" />
              </div>

              <!-- Región -->
              <div class="info-item">
                <label class="info-label" for="region">{{ t('addProperty.region') }}</label>
                <pv-input-text id="region" v-model="newProperty.region" class="info-input" />
              </div>

              <!-- Provincia -->
              <div class="info-item">
                <label class="info-label" for="province">{{ t('addProperty.province') }}</label>
                <pv-input-text id="province" v-model="newProperty.province" class="info-input" />
              </div>

              <!-- Ubigeo -->
              <div class="info-item">
                <label class="info-label" for="ubigeo">{{ t('addProperty.ubigeo') }}</label>
                <pv-input-text id="ubigeo" v-model="newProperty.ubigeo" class="info-input" />
              </div>

              <!-- Área en m² -->
              <div class="info-item">
                <label class="info-label" for="areaM2">{{ t('addProperty.areaM2') }}</label>
                <pv-input-number id="areaM2" v-model="newProperty.areaM2" class="info-input" />
              </div>

              <!-- Antigüedad -->
              <div class="info-item">
                <label class="info-label" for="yearsOld">{{ t('addProperty.yearsOld') }}</label>
                <pv-input-number id="yearsOld" v-model="newProperty.yearsOld" class="info-input" />
              </div>

              <!-- Estado -->
              <div class="info-item">
                <label class="info-label" for="status">{{ t('addProperty.status') }}</label>
                <pv-dropdown id="status" v-model="newProperty.status"
                             :options="['available','sold','maintenance']" class="info-input" />
              </div>

              <!-- Fecha de entrega -->
              <div class="info-item">
                <label class="info-label" for="handoverDate">{{ t('addProperty.handoverDate') }}</label>
                <pv-calendar id="handoverDate" v-model="newProperty.handoverDate" dateFormat="yy-mm-dd" class="info-input" />
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
import { Property } from "@/Property/domain/model/property.entity.js";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePropertyStore } from "@/Property/application/property-store.js";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store.js";

const { t } = useI18n();
const router = useRouter();
const propertyStore = usePropertyStore();
const subscriptionStore = useSubscriptionStore();

const newProperty = ref(new Property({
  d: Date.now().toString(),
  ownerId: null,
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
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser?.id) {
    alert("No user logged in.");
    return;
  }
  newProperty.value.ownerId = currentUser.id;

  await subscriptionStore.load(currentUser.id);
  await propertyStore.fetchProperties();

  const mySub = subscriptionStore.subscription;
  const userProps = propertyStore.properties.filter(p => p.ownerId === currentUser.id);

  let maxProps = 2;
  if (mySub?.plan === "premium") maxProps = 5;
  if (mySub?.plan === "enterprise") maxProps = Infinity;

  if (userProps.length >= maxProps) {
    alert(`Tu plan (${mySub?.plan || "sin suscripción"}) no permite más propiedades.`);
    return;
  }

  await propertyStore.createProperty(newProperty.value);
  router.push("/my-properties");
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