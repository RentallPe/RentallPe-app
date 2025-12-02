<template>
  <div class="add-property-wrapper">
    <pv-card class="add-property-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-home text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('addProperty.title') }}</h2>
        </div>
      </template>

      <!-- Contenido -->
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

              <!-- Descripción -->
              <div class="info-item">
                <label class="info-label" for="description">{{ t('addProperty.description') }}</label>
                <pv-input-text id="description" v-model="newProperty.description" class="info-input" />
              </div>

              <!-- Precio por hora -->
              <div class="info-item">
                <label class="info-label" for="pricePerHour">{{ t('addProperty.pricePerHour') }}</label>
                <pv-input-number id="pricePerHour" v-model="newProperty.pricePerHour" class="info-input" />
              </div>

              <!-- Tipo -->
              <div class="info-item">
                <label class="info-label" for="type">{{ t('addProperty.type') }}</label>
                <pv-dropdown id="type" v-model="newProperty.type" :options="['house','apartment','office']" class="info-input" />
              </div>

              <!-- Dirección (Location) -->
              <div class="info-item">
                <label class="info-label" for="address">{{ t('addProperty.address') }}</label>
                <pv-input-text id="address" v-model="newProperty.address" class="info-input" />
              </div>

              <!-- Servicios -->
              <div class="info-item">
                <label class="info-label" for="services">{{ t('addProperty.services') }}</label>
                <pv-multi-select id="services" v-model="newProperty.services"
                                 :options="availableServices" optionLabel="label" optionValue="value"
                                 display="chip" editable class="info-input" />
              </div>

              <!-- Área en m² -->
              <div class="info-item">
                <label class="info-label" for="areaM2">{{ t('addProperty.areaM2') }}</label>
                <pv-input-number id="areaM2" v-model="newProperty.areaM2" class="info-input" />
              </div>

              <!-- Estado -->
              <div class="info-item">
                <label class="info-label" for="status">{{ t('addProperty.status') }}</label>
                <pv-dropdown id="status" v-model="newProperty.status"
                             :options="['available','sold','maintenance']" class="info-input" />
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { usePropertyStore } from "@/Property/application/property-store.js";

const { t } = useI18n();
const router = useRouter();
const propertyStore = usePropertyStore();

// Opciones de servicios disponibles
const availableServices = [
  { label: "WiFi", value: "wifi" },
  { label: "Parking", value: "parking" },
  { label: "Cleaning", value: "cleaning" }
];

// Estado inicial de la propiedad
const newProperty = ref({
  name: "",
  description: "",
  pricePerHour: 0,
  type: "house",
  address: "",
  services: [],
  areaM2: 0,
  status: "available"
});

// Guardar propiedad
async function saveProperty() {
  try {
    const raw = localStorage.getItem("currentUser");
    const currentUser = raw ? JSON.parse(raw) : null;

    if (!currentUser?.id) {
      alert("Sesión inválida. Vuelve a iniciar sesión.");
      return;
    }

    const payload = {
      name: newProperty.value.name,
      description: newProperty.value.description,
      pricePerHour: Number(newProperty.value.pricePerHour),
      type: newProperty.value.type,
      location: newProperty.value.address,
      ownerId: Number(currentUser.id),
      services: newProperty.value.services.map(s => typeof s === "string" ? s : s.value),
      status: newProperty.value.status,
      areaM2: Number(newProperty.value.areaM2)
    };

    const saved = await propertyStore.createProperty(payload);

    if (!saved || !saved.id) {
      alert("No se pudo guardar la propiedad.");
      return;
    }

    router.push("/my-properties");
  } catch (err) {
    console.error("Error fatal en saveProperty:", err);
    alert("Error crítico al guardar la propiedad.");
  }
}

function selectImage() {
  alert("Función de subir imagen pendiente de implementación.");
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