<template>
  <div class="combo-detail-wrapper">
    <pv-card class="combo-detail-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <!-- Título -->
          <h2 class="m-0 text-black">{{ combo?.name }}</h2>

          <router-link to="/new-project">
            <pv-button
                icon="pi pi-arrow-left"
                severity="secondary"
                class="square-btn"
            />
          </router-link>
        </div>
      </template>


      <template #content>
        <div class="grid">

          <div class="col-12 md:col-4 flex justify-content-center">
            <img :src="combo?.image" alt="" class="combo-img" />
          </div>


          <div class="col-12 md:col-4">
            <h3>Description</h3>

            <p>{{ combo?.description }}</p>
            <p><strong>Installation time:</strong> {{ combo?.installDays }} days</p>

          </div>




          <div class="col-12 md:col-4 flex flex-column justify-content-between">

            <div>
              <h3>Send to</h3>
              <pv-button
                  :label="selectedAddress?.address || 'Select address'"
                  icon="pi pi-map-marker"
                  class="mb-3"
                  @click="addressDialog = true"
              />
            </div>
            <div class="address-divider"></div>
            <div class="mt-auto">
              <h3>Price</h3>
              <p class="price-text">$ {{ combo?.price }}</p>
              <pv-button
                  label="Buy"
                  severity="danger"
                  icon="pi pi-shopping-cart"
                  class="w-full"
                  @click="buyCombo"
              />
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Dialog selección de dirección -->
    <pv-dialog v-model:visible="addressDialog" header="Select the direction" modal :style="{ width: '30vw' }">
      <div class="address-dropdown">

        <div class="address-divider"></div>

        <ul class="address-list">
          <li
              v-for="property in user.properties"
              :key="property.id"
              class="address-item"
              @click="selectAddress(property)"
          >
            {{ property.address }}
          </li>
        </ul>
      </div>
    </pv-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useRentalStore } from "@/Rental/application/rental-store";

const route = useRoute();
const rental = useRentalStore();

const providers = rental.list("providers");
const properties = rental.list("properties");

const combo = ref(null);
const selectedAddress = ref(null);
const addressDialog = ref(false);

onMounted(async () => {
  await Promise.all([
    rental.fetchAll("providers"),
    rental.fetchAll("properties"),
  ]);

  const id = String(route.params.id || "");
  combo.value = buildComboFromId(id, providers.value || []);
  selectedAddress.value = (properties.value || [])[0] || null;
});

function buildComboFromId(id, provs) {
  
  const m = id.match(/^c-(.+?)-basic$/);
  const providerId = m ? m[1] : id;
  const p = (provs || []).find(x => String(x.id) === String(providerId)) || {};
  return {
    id: `c-${providerId}-basic`,
    name: `Basic combo by ${p.name || "Provider"}`,
    description: "Basic sensors + installation.",
    price: 199,
    installDays: 3,
    providerId: p.id,
    image: `https://picsum.photos/seed/combo-${providerId}/640/360`,
  };
}

function selectAddress(property) {
  selectedAddress.value = property;
  addressDialog.value = false;
}

async function buyCombo() {
  if (!selectedAddress.value || !combo.value) return;
  const target = { ...selectedAddress.value };
  const prev = Array.isArray(target.combos) ? target.combos : [];
  target.combos = [
    ...prev,
    {
      id: combo.value.id,
      name: combo.value.name,
      providerId: combo.value.providerId,
      price: combo.value.price,
      installDays: combo.value.installDays,
    },
  ];
  await rental.update("properties", target); 
}

const providerNameById = computed(() =>
  Object.fromEntries((providers.value || []).map(p => [String(p.id), p.name]))
);
function getProviderName(id) {
  return providerNameById.value[String(id)] || "Unknown";
}
</script>


<style scoped>
.combo-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}
.combo-detail-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
}
.combo-img {
  width: 100%;
  border-radius: 8px;
}
.combo-detail-card {
  color: #252525;
}
.square-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border: #d50a0a;
  border-radius: 8px;
  background: #f76c6c;
  justify-content: center;
}
.address-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fafafa; /* negro */
  margin-bottom: 0.5rem;
}

.address-divider {
  height: 3px;
  background-color: #b22222;
  margin-bottom: 1rem;
  border-radius: 2px;
}

.address-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.address-item {
  background: #fff;
  border: 2px solid #b22222;
  color: #000;
  padding: 0.8rem 1rem;
  margin-bottom: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-item:hover {
  background: #fff;
  border-color: #8b1a1a;
  color: #b22222;
  font-weight: 600;
}
.address-divider-vertical {
  width: 3px;                  /* grosor de la línea */
  height: 100%;                /* ocupa todo el alto del contenedor */
  background-color: #b22222;   /* rojo ladrillo */
  margin: 0 1rem;              /* espacio a los lados */
  border-radius: 2px;
}
</style>