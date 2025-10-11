<template>
  <div class="provider-detail-wrapper">
    <pv-card class="provider-detail-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2 class="m-0 text-black">{{ provider?.name }}</h2>
          <router-link to="/new-project">
            <pv-button icon="pi pi-arrow-left" severity="secondary" class="square-btn" />
          </router-link>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <p><strong>Contact:</strong> {{ provider?.contact }}</p>

        <h3 class="mt-4">Combos offered</h3>
        <div class="grid">
          <div
              v-for="combo in combos"
              :key="combo.id"
              class="col-12 md:col-4"
              @click="selectCombo(combo)"
          >
            <div class="combo-card cursor-pointer">
              <img :src="combo.image" alt="" class="combo-img" />
              <h4>{{ combo.name }}</h4>
              <p class="text-sm">{{ combo.description }}</p>
              <p class="text-sm"><strong>Price:</strong> ${{ combo.price }}</p>
            </div>
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
        <p><strong>Provider:</strong> {{ provider?.name }}</p>

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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const provider = ref(null);
const combos = ref([]);
const properties = ref([]);

const dialogVisible = ref(false);
const addressDialog = ref(false);

const selectedCombo = ref(null);
const selectedAddress = ref(null);

onMounted(async () => {
  // Cargar proveedor
  const resProvider = await axios.get(`http://localhost:3000/providers/${route.params.id}`);
  provider.value = resProvider.data;

  // Cargar combos de este proveedor
  const resCombos = await axios.get(`http://localhost:3000/combos?providerId=${route.params.id}`);
  combos.value = resCombos.data;

  // Cargar propiedades del usuario
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

  const updatedProperty = {
    ...selectedAddress.value,
    combos: [...(selectedAddress.value.combos || []), selectedCombo.value]
  };

  await axios.patch(`http://localhost:3000/properties/${selectedAddress.value.id}`, updatedProperty);

  alert("Combo purchased and assigned to property!");
  dialogVisible.value = false;
}
</script>

<style scoped>
.provider-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}
.provider-detail-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
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
.square-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
}
</style>