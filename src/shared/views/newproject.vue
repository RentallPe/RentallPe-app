<template>
  <div class="new-project-wrapper">
    <pv-card class="new-project-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-home text-primary text-2xl"></i>
          <h2 class="m-0 text-black">New Project</h2>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <!-- Combos -->
        <h3 class="m-0 subtitle">Our combos</h3>
        <div class="grid">
          <div
              v-for="combo in combos"
              :key="combo.id"
              class="col-12 md:col-4"
              @click="selectCombo(combo)"
          >
            <div class="combo-card cursor-pointer">
              <img :src="combo.image" alt="" class="combo-img" />
              <h3 class="combo-title">{{ combo.name }}</h3>
              <p class="text-sm">Provider: {{ getProviderName(combo.providerId) }}</p>
            </div>
          </div>
        </div>

        <!-- Providers -->
        <h3 class="m-0 subtitle mt-5">Providers</h3>
        <div class="grid small-providers">
          <div v-for="provider in providers" :key="provider.id" class="col-12 md:col-3">
            <router-link :to="`/provider/${provider.id}`" class="no-underline">
              <pv-card class="provider-card">
                <template #title>{{ provider.name }}</template>
                <template #content>
                  <p class="text-sm">{{ provider.contact }}</p>
                </template>
              </pv-card>
            </router-link>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Dialog detalle combo -->
    <pv-dialog v-model:visible="dialogVisible" header="Combo detail" modal :style="{ width: '40vw' }">
      <template v-if="selectedCombo">
        <img :src="selectedCombo.image" alt="" class="combo-img mb-3" />
        <h3>{{ selectedCombo.name }}</h3>
        <p>{{ selectedCombo.description }}</p>
        <p><strong>Installation time:</strong> {{ selectedCombo.installDays }} days</p>
        <p><strong>Provider:</strong> {{ getProviderName(selectedCombo.providerId) }}</p>

        <div class="flex align-items-center gap-2 mt-3">
          <span><strong>Send to:</strong></span>
          <pv-button
              :label="selectedAddress?.address || 'Select address'"
              icon="pi pi-map-marker"
              @click="addressDialog = true"
          />
        </div>

        <div class="flex justify-content-end mt-4">
          <pv-button
              :label="`Buy - $${selectedCombo.price}`"
              severity="danger"
              icon="pi pi-shopping-cart"
              @click="buyCombo"
          />
        </div>
      </template>
    </pv-dialog>

    <!-- Dialog selección de dirección -->
    <pv-dialog v-model:visible="addressDialog" header="Select address" modal :style="{ width: '30vw' }">
      <ul>
        <li
            v-for="property in properties"
            :key="property.id"
            class="cursor-pointer mb-2"
            @click="selectAddress(property)"
        >
          {{ property.name }} - {{ property.address }}
        </li>
      </ul>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const combos = ref([]);
const providers = ref([]);
const properties = ref([]);

const dialogVisible = ref(false);
const addressDialog = ref(false);

const selectedCombo = ref(null);
const selectedAddress = ref(null);

onMounted(async () => {
  const resCombos = await axios.get("http://localhost:3000/combos");
  combos.value = resCombos.data;

  const resProviders = await axios.get("http://localhost:3000/providers");
  providers.value = resProviders.data;

  const resProperties = await axios.get("http://localhost:3000/properties");
  properties.value = resProperties.data;
});

function selectCombo(combo) {
  selectedCombo.value = combo;
  dialogVisible.value = true;
}

function selectAddress(property) {
  selectedAddress.value = property;
  addressDialog.value = false;
}

async function buyCombo() {
  if (!selectedAddress.value) {
    alert("Please select an address first.");
    return;
  }

  // 1. Actualizar la propiedad con el combo comprado
  const propertyId = String(selectedAddress.value.id);
  const updatedProperty = {
    ...selectedAddress.value,
    combos: [...(selectedAddress.value.combos || []), selectedCombo.value]
  };

  await axios.patch(`http://localhost:3000/properties/${propertyId}`, updatedProperty);

  // 2. Crear un registro de pago con info extra
  const savedUser = localStorage.getItem("currentUser");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const newPayment = {
    id: Date.now(),
    comboId: Number(selectedCombo.value.id),
    providerId: Number(selectedCombo.value.providerId),
    customerId: Number(currentUser?.id),
    customerName: currentUser?.fullName || "Unknown",
    propertyId: Number(selectedAddress.value.id),
    propertyName: selectedAddress.value.name,
    amount: Number(selectedCombo.value.price),
    date: new Date().toISOString(),
    status: "pending"
  };

  await axios.post("http://localhost:3000/payments", newPayment);

  alert("Combo purchased and payment registered!");
  dialogVisible.value = false;
}


function getProviderName(providerId) {
  const provider = providers.value.find(p => p.id === providerId);
  return provider ? provider.name : "Unknown";
}
</script>

<style scoped>
.new-project-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}
.new-project-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}
.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
}
.combo-card {
  transition: transform 0.2s;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #eeeeee;
  padding: 1rem;
}
.combo-card:hover {
  transform: scale(1.02);
  border-color: #b22222;
}
.combo-img {
  width: 100%;
  border-radius: 8px;
}
.combo-title {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #111111;
}
.small-providers .provider-card {
  font-size: 0.85rem;
  padding: 0.5rem;
}
.text-black {
  color: #000;
}

.combo-card,
.combo-card h3,
.combo-card p {
  color: #111111 !important;
}


.provider-card,
.provider-card h3,
.provider-card p {
  color: #ffffff !important;
  background-color: #373737;
}

</style>