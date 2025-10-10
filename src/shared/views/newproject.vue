<template>
  <div class="new-project-wrapper">
    <pv-card class="new-project-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('newProject.title') }}</h2>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <h3 class="m-0 subtitle">{{ t('newProject.ourCombos') }}</h3>

        <div class="grid">
          <div v-for="combo in combos" :key="combo.id" class="col-12 md:col-4">
            <router-link :to="`/combo/${combo.id}`" class="no-underline">
              <img :src="combo.image" alt="" class="combo-img" />
              <h3 class="combo-title">{{ combo.name }}</h3>
            </router-link>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Dialog detalle -->
    <pv-dialog v-model:visible="dialogVisible" :header="t('newProject.comboDetail')" modal :style="{ width: '40vw' }">
      <template v-if="selectedCombo">
        <img :src="selectedCombo.image" alt="" class="combo-img mb-3" />
        <h3>{{ selectedCombo.name }}</h3>
        <p>{{ selectedCombo.description }}</p>
        <p>
          <strong>{{ t('newProject.installationTime') }}:</strong>
          {{ selectedCombo.installDays }} {{ t('newProject.days') }}
        </p>

        <div class="flex align-items-center gap-2 mt-3">
          <span><strong>{{ t('newProject.sendTo') }}:</strong></span>
          <pv-button
              :label="selectedAddress?.address || t('newProject.selectAddress')"
              icon="pi pi-map-marker"
              @click="addressDialog = true"
          />
        </div>

        <div class="flex justify-content-end mt-4">
          <pv-button
              :label="t('newProject.buyWithPrice', { price: selectedCombo.price })"
              severity="danger"
              icon="pi pi-shopping-cart"
              @click="buyCombo"
          />
        </div>
      </template>
    </pv-dialog>

    <!-- Dialog selección de dirección -->
    <pv-dialog v-model:visible="addressDialog" :header="t('newProject.selectAddress')" modal :style="{ width: '30vw' }">
      <ul>
        <li
            v-for="property in user.properties"
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const combos = ref([]);
const user = ref({ properties: [] });

const dialogVisible = ref(false);
const addressDialog = ref(false);

const selectedCombo = ref(null);
const selectedAddress = ref(null);

onMounted(async () => {
  const resCombos = await fetch("http://localhost:3000/combos");
  combos.value = await resCombos.json();

  const resUser = await fetch("http://localhost:3000/user");
  user.value = await resUser.json();
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
    alert(t('newProject.alertSelectAddress'));
    return;
  }

  const updatedProperties = user.value.properties.map(p => {
    if (p.id === selectedAddress.value.id) {
      return {
        ...p,
        combos: [...(p.combos || []), selectedCombo.value]
      };
    }
    return p;
  });

  await fetch("http://localhost:3000/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ properties: updatedProperties })
  });

  alert(t('newProject.alertPurchased'));
  dialogVisible.value = false;
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

.text-black {
  color: #000;
}

</style>