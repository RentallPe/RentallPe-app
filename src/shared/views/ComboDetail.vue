<template>
  <div class="combo-detail-wrapper">
    <pv-card class="combo-detail-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2 class="m-0 text-black">{{ combo?.name }}</h2>
          <router-link to="/new-project">
            <pv-button icon="pi pi-arrow-left" severity="secondary" class="square-btn" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Imagen -->
          <div class="col-12 md:col-4 flex justify-content-center">
            <img :src="combo?.image" alt="" class="combo-img" />
          </div>

          <!-- Descripción -->
          <div class="col-12 md:col-4">
            <h3>{{ t('comboDetail.description') }}</h3>
            <p>{{ combo?.description }}</p>
            <p>
              <strong>{{ t('comboDetail.installationTime') }}:</strong>
              {{ combo?.installDays }} {{ t('comboDetail.days') }}
            </p>
          </div>

          <!-- Envío y compra -->
          <div class="col-12 md:col-4 flex flex-column justify-content-between">
            <div>
              <h3>{{ t('comboDetail.sendTo') }}</h3>
              <pv-button
                  :label="selectedAddress?.address || t('comboDetail.selectAddress')"
                  icon="pi pi-map-marker"
                  class="mb-3"
                  @click="addressDialog = true"
              />
            </div>
            <div class="address-divider"></div>
            <div class="mt-auto">
              <h3>{{ t('comboDetail.price') }}</h3>
              <p class="price-text">$ {{ combo?.price }}</p>
              <pv-button
                  :label="t('comboDetail.buy')"
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
    <pv-dialog v-model:visible="addressDialog" :header="t('comboDetail.dialogTitle')" modal :style="{ width: '30vw' }">
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const combo = ref(null);
const user = ref({ properties: [] });
const selectedAddress = ref(null);
const addressDialog = ref(false);

onMounted(async () => {
  const resCombo = await fetch(`http://localhost:3000/combos/${route.params.id}`);
  combo.value = await resCombo.json();

  const resUser = await fetch("http://localhost:3000/user");
  user.value = await resUser.json();
  selectedAddress.value = user.value.properties[0];
});

function selectAddress(property) {
  selectedAddress.value = property;
  addressDialog.value = false;
}

async function buyCombo() {
  if (!selectedAddress.value) {
    alert(t('comboDetail.alertSelectAddress'));
    return;
  }

  const updatedProperties = user.value.properties.map(p => {
    if (p.id === selectedAddress.value.id) {
      return {
        ...p,
        combos: [...(p.combos || []), combo.value]
      };
    }
    return p;
  });

  await fetch("http://localhost:3000/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ properties: updatedProperties })
  });

  alert(t('comboDetail.alertPurchased'));
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
  width: 3px;
  height: 100%;
  background-color: #b22222;
  margin: 0 1rem;
  border-radius: 2px;
}
</style>