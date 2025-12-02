<template>
  <div class="provider-detail-wrapper">
    <pv-card class="provider-detail-card">

      <!-- HEADER -->
      <template #title>
        <div class="header">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-building header-icon"></i>
            <h2 class="page-title">{{ provider?.name }}</h2>
          </div>

          <router-link to="/new-project">
            <pv-button icon="pi pi-arrow-left" severity="secondary" rounded />
          </router-link>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>

        <p class="provider-contact">
          <strong>{{ t("providerDetail.contact") }}:</strong> {{ provider?.contact }}
        </p>

        <!-- COMBOS -->
        <h3 class="section-title mt-4">{{ t("providerDetail.combos") }}</h3>

        <div class="grid">
          <div
              v-for="combo in combos"
              :key="combo.id"
              class="col-12 md:col-4"
              @click="selectCombo(combo)"
          >
            <div class="combo-card">
              <img :src="combo.image" class="combo-img" />

              <div class="combo-content">
                <h3 class="combo-title">
                  {{ combo.name }}
                  <span
                      v-if="combo.planType === 'premium'"
                      class="badge premium"
                  >{{ t("providerDetail.premium") }}</span>

                  <span
                      v-if="combo.planType === 'enterprise'"
                      class="badge enterprise"
                  >{{ t("providerDetail.enterprise") }}</span>
                </h3>

                <p class="price">${{ combo.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- DIALOG COMBO -->
    <pv-dialog
        v-model:visible="dialogVisible"
        modal
        :style="{ width: '42vw' }"
        class="combo-dialog"
    >

      <template v-if="selectedCombo">
        <!-- HERO -->
        <div class="combo-detail-hero">
          <img :src="selectedCombo.image" />
          <div class="combo-detail-overlay">
            <h2>{{ selectedCombo.name }}</h2>

            <span v-if="selectedCombo.planType === 'premium'" class="badge premium">
              {{ t("providerDetail.premium") }}
            </span>

            <span v-if="selectedCombo.planType === 'enterprise'" class="badge enterprise">
              {{ t("providerDetail.enterprise") }}
            </span>
          </div>
        </div>

        <!-- BODY -->
        <div class="combo-detail-body">
          <p class="combo-detail-desc">
            {{ selectedCombo.description }}
          </p>

          <div class="combo-detail-grid">
            <div class="detail-box">
              <i class="pi pi-clock"></i>
              <strong>{{ selectedCombo.installDays }} {{ t("providerDetail.days") }}</strong>
            </div>

            <div class="detail-box">
              <i class="pi pi-building"></i>
              <strong>{{ provider?.name }}</strong>
            </div>

            <div class="detail-box price-box">
              <i class="pi pi-tag"></i>
              <strong>${{ selectedCombo.price }}</strong>
            </div>
          </div>

          <!-- ADDRESS -->
          <div class="address-select">
            <span>{{ t("providerDetail.sendTo") }}</span>
            <pv-button
                class="address-btn"
                :label="selectedAddress?.address || t('providerDetail.selectAddress')"
                icon="pi pi-map-marker"
                @click="addressDialog = true"
            />
          </div>

          <!-- ACTION -->
          <div class="combo-detail-actions">
            <pv-button
                :label="t('providerDetail.buyNow')"
                icon="pi pi-shopping-cart"
                severity="danger"
                class="buy-btn"
                @click="buyCombo"
            />
          </div>
        </div>
      </template>
    </pv-dialog>

    <!-- DIALOG ADDRESS -->
    <pv-dialog v-model:visible="addressDialog" :header="t('providerDetail.selectAddress')" modal :style="{ width: '30vw' }">
      <ul class="address-list">
        <li
            v-for="property in properties"
            :key="property.id"
            @click="selectAddress(property)"
        >
          <i class="pi pi-home"></i>
          {{ property.name }} — {{ property.address }}
        </li>
      </ul>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useProviderStore } from "@/Provider/application/provider-store.js";
import { usePropertyStore } from "@/Property/application/property-store.js";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";
import { usePaymentStore } from "@/Rental/application/payment-store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const providerStore = useProviderStore();
const propertyStore = usePropertyStore();
const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const paymentStore = usePaymentStore();
const monitoringStore = useMonitoringStore();

const dialogVisible = ref(false);
const addressDialog = ref(false);

const selectedCombo = ref(null);
const selectedAddress = ref(null);

const providerId = computed(() => String(route.params.id));

onMounted(async () => {
  await Promise.all([
    providerStore.fetchProviders(),
    providerStore.fetchCombos(),
    propertyStore.fetchProperties(),
    subscriptionStore.load(userStore.user?.id)
  ]);

  selectedAddress.value = propertyStore.properties?.[0] || null;
});

const provider = computed(() =>
    providerStore.providers.find(p => String(p.id) === providerId.value)
);

const combos = computed(() =>
    providerStore.combos.filter(c => String(c.providerId) === providerId.value)
);

const properties = computed(() => propertyStore.properties || []);

function selectCombo(combo) {
  selectedCombo.value = combo;
  dialogVisible.value = true;
}

function selectAddress(property) {
  selectedAddress.value = property;
  addressDialog.value = false;
}

/* ⭐ MISMA COMPRA QUE NewProject ⭐ */
async function buyCombo() {
  if (!selectedAddress.value || !selectedCombo.value) return;

  const currentUser = userStore.user;
  const sub = subscriptionStore.subscription;

  if (sub?.plan !== "premium" && selectedCombo.value.planType === "premium") {
    alert("Debes tener plan Premium.");
    return;
  }

  if (selectedCombo.value.planType === "enterprise") {
    alert("Combo Enterprise no permitido.");
    return;
  }

  /* UPDATE PROPERTY */
  const updatedProperty = {
    ...selectedAddress.value,
    combos: [...(selectedAddress.value.combos || []), selectedCombo.value]
  };
  await propertyStore.updateProperty(updatedProperty);

  /* CREATE PAYMENT */
  await paymentStore.createPayment({
    id: String(Date.now()),
    comboId: String(selectedCombo.value.id),
    providerId: String(selectedCombo.value.providerId),
    customerId: String(currentUser.id),
    customerName: currentUser.fullName,
    propertyId: String(selectedAddress.value.id),
    propertyName: selectedAddress.value.name,
    amount: Number(selectedCombo.value.price),
    date: new Date().toISOString(),
    status: "pending"
  });

  /* CREATE PROJECT */
  const project = await monitoringStore.createProject({
    id: String(Date.now()),
    propertyId: String(selectedAddress.value.id),
    userId: String(currentUser.id),
    name: `Proyecto ${selectedCombo.value.name}`,
    description: `Instalación de ${selectedCombo.value.name}`,
    status: "active",
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });

  /* CREATE DEVICES */
  if (Array.isArray(selectedCombo.value.devices)) {
    for (const d of selectedCombo.value.devices) {
      await monitoringStore.createDevice({
        id: String(Date.now() + Math.random()),
        projectId: project.id,
        type: d.type,
        status: "active",
        installedAt: new Date().toISOString()
      });
    }
  }

  dialogVisible.value = false;
  router.push(`/projects/${project.id}/devices`);
}
</script>

<style scoped>
.provider-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

.provider-detail-card {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 20px;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-icon {
  font-size: 2rem;
  color: #b22222;
}

.combo-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  cursor: pointer;
  transition: .25s;
}

.combo-card:hover {
  transform: translateY(-6px);
}

.combo-img {
  height: 180px;
  width: 100%;
  object-fit: cover;
}

.combo-content {
  padding: .8rem;
}

.price {
  font-weight: bold;
}

.badge {
  margin-left: .4rem;
  font-size: .7rem;
  padding: .15rem .6rem;
  border-radius: 999px;
  font-weight: 700;
}

.badge.premium { background: gold; }
.badge.enterprise { background: #2563eb; color: white; }

.address-list li {
  cursor: pointer;
  padding: .5rem;
}

.address-list li:hover {
  background: #f1f5f9;
}

.provider-detail-card,
.provider-detail-card h1,
.provider-detail-card h2,
.provider-detail-card h3,
.provider-detail-card h4,
.provider-detail-card h5,
.provider-detail-card h6,
.provider-detail-card p,
.provider-detail-card span,
.provider-detail-card strong,
.provider-detail-card li {
  color: #000 !important;
}

/* También dentro de los diálogos */
.combo-dialog,
.combo-dialog h1,
.combo-dialog h2,
.combo-dialog h3,
.combo-dialog h4,
.combo-dialog h5,
.combo-dialog h6,
.combo-dialog p,
.combo-dialog span,
.combo-dialog strong,
.combo-dialog li {
  color: #000 !important;
}

</style>
