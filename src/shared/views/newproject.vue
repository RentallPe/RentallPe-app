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
      <div class="grid grid-reset">
        <div v-for="combo in combos" :key="combo.id" class="col-12 md:col-4 col-fix" @click="selectCombo(combo)">
            <div class="combo-card cursor-pointer">
              <img :src="combo.image" alt="" class="combo-img" />
              <h3 class="combo-title">{{ combo.name }}</h3>
              <p class="text-sm">Provider: {{ getProviderName(combo.providerId) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Providers -->
          <h3 class="m-0 subtitle mt-5">Providers</h3>
          <div class="grid grid-reset small-providers">
           <div v-for="provider in providers" :key="provider.id" class="col-12 md:col-3 col-fix">
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
import { ref, onMounted, computed } from "vue";
import { useRentalStore } from "@/Rental/application/rental-store";

const rental = useRentalStore();

const combos = ref([]);
const providers = rental.list("providers");
const properties = rental.list("properties");

const dialogVisible = ref(false);
const addressDialog = ref(false);
const selectedCombo = ref(null);
const selectedAddress = ref(null);

onMounted(async () => {
  await Promise.all([
    rental.fetchAll("providers"),
    rental.fetchAll("properties"),
  ]);

  // Genera combos sintéticos por proveedor (no hay colección 'combos' en tu backend)
  const ps = providers.value || [];
  combos.value = ps.map((p) => ({
    id: `c-${p.id}-basic`,
    name: `Basic combo by ${p.name}`,
    description: "Basic sensors + installation.",
    price: 199,
    installDays: 3,
    providerId: p.id,
    image: `https://picsum.photos/seed/combo-${p.id}/640/360`,
  }));
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
  if (!selectedAddress.value || !selectedCombo.value) return;

  const target = { ...selectedAddress.value };
  const prev = Array.isArray(target.combos) ? target.combos : [];
  const toAdd = {
    id: selectedCombo.value.id,
    name: selectedCombo.value.name,
    providerId: selectedCombo.value.providerId,
    price: selectedCombo.value.price,
    installDays: selectedCombo.value.installDays,
  };
  target.combos = [...prev, toAdd];

  await rental.update("properties", target); 
  dialogVisible.value = false;
}

const providerNameById = computed(() =>
  Object.fromEntries((providers.value || []).map((p) => [String(p.id), p.name]))
);
function getProviderName(id) {
  return providerNameById.value[String(id)] || "Unknown";
}
</script>


<style scoped>
:root { --sbw: 238px; }


.new-project-wrapper{
  margin-left: var(--sbw);
  width: calc(100% - var(--sbw));
  padding: 24px;
  box-sizing: border-box;
  min-height: 100dvh;
  background: #f9fafb;
  overflow-x: hidden;        
}


.new-project-card{
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
}


.grid-reset{ margin-left: 0 !important; margin-right: 0 !important; }
.grid-reset > [class*="col-"]{ padding-left: .75rem; padding-right: .75rem; }
.col-fix{ min-width: 0; }


.subtitle{ font-size: 1.2rem; margin-bottom: 1.2rem; color:#555; }
.combo-card{
  display:flex; flex-direction:column; height:100%;
  text-align:center; background:#f4f4f4; border:1px solid #eee;
  border-radius:12px; padding:1rem; transition:transform .2s;
}
.combo-card:hover{ transform: translateY(-2px); border-color:#b22222; }
.combo-img{ width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px; }
.combo-title{ margin-top:.5rem; font-weight:600; color:#111; }
.small-providers .provider-card{ font-size:.9rem; padding:.75rem; height:100%; }
.text-black{ color:#000; }


@media (max-width: 1280px){
  .new-project-wrapper{ margin-left: 0; width: 100%; }
}
@media (max-width: 1024px){
  .new-project-card{ border-radius:12px; }
  .grid-reset > [class*="col-"]{ padding-left:.6rem; padding-right:.6rem; }
}


</style>
