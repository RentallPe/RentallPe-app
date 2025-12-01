<template>
  <div class="new-project-wrapper">
    <pv-card class="new-project-card">

      <!-- TÍTULO -->
      <template #title>
        <div class="header">
          <i class="pi pi-home header-icon"></i>
          <h2 class="page-title">New Project</h2>
        </div>
      </template>

      <!-- CONTENIDO -->
      <template #content>

        <!-- COMBOS -->
        <h3 class="section-title">Our Combos</h3>
        <div class="grid">
          <div
              v-for="combo in visibleCombos"
              :key="combo.id"
              class="col-12 md:col-4"
              @click="selectCombo(combo)"
          >
            <div class="combo-card">
              <img :src="combo.image" class="combo-img" />

              <div class="combo-content">
                <h3 class="combo-title">
                  {{ combo.name }}
                  <span v-if="combo.planType === 'premium'" class="badge premium">Premium</span>
                  <span v-if="combo.planType === 'enterprise'" class="badge enterprise">Enterprise</span>
                </h3>

                <p class="provider-text">
                  <i class="pi pi-building"></i>
                  {{ getProviderName(combo.providerId) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- PROVIDERS -->
        <h3 class="section-title mt-6">Providers</h3>
        <div class="grid small-providers">
          <div
              v-for="provider in providers"
              :key="provider.id"
              class="col-12 md:col-3"
          >
            <router-link :to="`/provider/${provider.id}`" class="no-underline">
              <div class="provider-card">
                <h4>{{ provider.name }}</h4>
                <p>{{ provider.contact }}</p>
              </div>
            </router-link>
          </div>
        </div>

      </template>
    </pv-card>
    <pv-dialog
        v-model:visible="dialogVisible"
        modal
        :style="{ width: '42vw' }"
        class="combo-dialog"
        header=" "
    >
      <template v-if="selectedCombo">
        <!-- Imagen -->
        <div class="combo-detail-hero">
          <img :src="selectedCombo.image" />
          <div class="combo-detail-overlay">
            <h2>{{ selectedCombo.name }}</h2>

            <span
                v-if="selectedCombo.planType === 'premium'"
                class="badge premium"
            >
          Premium
        </span>

            <span
                v-if="selectedCombo.planType === 'enterprise'"
                class="badge enterprise"
            >
          Enterprise
        </span>
          </div>
        </div>

        <!-- Info -->
        <div class="combo-detail-body">
          <p class="combo-detail-desc">
            {{ selectedCombo.description }}
          </p>

          <div class="combo-detail-grid">
            <div class="detail-box">
              <i class="pi pi-clock"></i>
              <div>
                <span>Installation</span>
                <strong>{{ selectedCombo.installDays }} days</strong>
              </div>
            </div>

            <div class="detail-box">
              <i class="pi pi-building"></i>
              <div>
                <span>Provider</span>
                <strong>{{ getProviderName(selectedCombo.providerId) }}</strong>
              </div>
            </div>

            <div class="detail-box price-box">
              <i class="pi pi-tag"></i>
              <div>
                <span>Price</span>
                <strong>${{ selectedCombo.price }}</strong>
              </div>
            </div>
          </div>

          <!-- Dirección -->
          <div class="address-select">
            <span>Send to:</span>
            <pv-button
                class="address-btn"
                :label="selectedAddress?.address || 'Select address'"
                icon="pi pi-map-marker"
                @click="addressDialog = true"
            />
          </div>

          <!-- Acciones -->
          <div class="combo-detail-actions">
            <pv-button
                label="Buy Now"
                icon="pi pi-shopping-cart"
                severity="danger"
                class="buy-btn"
                @click="buyCombo"
            />
          </div>
        </div>
      </template>
    </pv-dialog>

    <!-- DIALOG COMBO -->


    <!-- DIALOG ADDRESS -->
    <pv-dialog v-model:visible="addressDialog" header="Select Address" modal :style="{ width: '30vw' }">
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
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { usePropertyStore } from "@/Property/application/property-store.js";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";
import { usePaymentStore } from "@/Rental/application/payment-store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";
import { useRouter } from "vue-router";

const router = useRouter();

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

onMounted(async () => {
  await Promise.all([
    providerStore.fetchCombos(),
    providerStore.fetchProviders(),
    propertyStore.fetchProperties(),
    monitoringStore.fetchDevices(),
    subscriptionStore.load(userStore.user?.id)
  ]);
  console.log("Providers:", providerStore.providers);
  console.log("Combos:", providerStore.combos);
});

const providers = computed(() => providerStore.providers || []);
const currentUser = computed(() => userStore.user);
const properties = computed(() => {
  const all = propertyStore.properties || [];
  if (!currentUser.value) return [];
  return all.filter(p => String(p.ownerId) === String(currentUser.value.id));
});

const devices = computed(() => monitoringStore.iotDevices || []);


const visibleCombos = computed(() => providerStore.combos);

function getProviderName(providerId) {
  const provider = providers.value.find(p => p.id == providerId);
  return provider ? provider.name : "Unknown";
}

function selectCombo(combo) {
  selectedCombo.value = combo;
  dialogVisible.value = true;
}

function selectAddress(property) {
  selectedAddress.value = property;
  addressDialog.value = false;
}


async function buyCombo() {
  // 1. Validar propiedad seleccionada
  if (!selectedAddress.value || !selectedAddress.value.id) {
    alert("Selecciona una propiedad válida primero.");
    return;
  }

  // 2. Validar usuario
  const currentUser = userStore.user;
  if (!currentUser || !currentUser.id) {
    alert("Sesión inválida. Vuelve a iniciar sesión.");
    return;
  }

  // 3. Validar combo seleccionado
  if (!selectedCombo.value || !selectedCombo.value.id) {
    alert("Selecciona un combo válido primero.");
    return;
  }

  // 4. Validar plan
  const sub = subscriptionStore.subscription;
  if (sub?.plan !== "premium" && selectedCombo.value.planType === "premium") {
    alert("Debes tener plan Premium para este combo.");
    return;
  }
  if (selectedCombo.value.planType === "enterprise") {
    alert("Los combos Enterprise no se pueden comprar con tu suscripción actual.");
    return;
  }

  // 5. Actualizar propiedad
  const updatedProperty = {
    ...selectedAddress.value,
    combos: [...(selectedAddress.value.combos || []), selectedCombo.value]
  };
  await propertyStore.updateProperty(updatedProperty);

  // 6. Crear pago
  const newPayment = {
    id: String(Date.now()),
    comboId: Number(selectedCombo.value.id),
    providerId: Number(selectedCombo.value.providerId),
    customerId: Number(currentUser.id),
    customerName: currentUser.fullName || "Unknown",
    propertyId: Number(selectedAddress.value.id),
    propertyName: selectedAddress.value.name,
    amount: Number(selectedCombo.value.price),
    date: new Date().toISOString(),
    status: "pending"
  };
  await paymentStore.createPayment(newPayment);

  // 7. Crear proyecto
  const newProject = {
    id: String(Date.now()),
    propertyId: updatedProperty.id ? String(updatedProperty.id) : null,
    userId: currentUser.id ? String(currentUser.id) : null,
    name: `Proyecto ${selectedCombo.value.name}`,
    description: `Instalación de ${selectedCombo.value.name}`,
    status: "active",
    startDate: new Date().toISOString(),
    endDate: null,
    createdAt: new Date().toISOString()
  };


  const savedProject = await monitoringStore.createProject(newProject);
  if (!savedProject || !savedProject.id) {
    alert("No se pudo crear el proyecto.");
    return;
  }

  // 8. Crear dispositivos IoT
  if (Array.isArray(selectedCombo.value.devices)) {
    for (const d of selectedCombo.value.devices) {
      await monitoringStore.createDevice({
        id: String(Date.now() + Math.random()),
        projectId: savedProject.id,
        type: d.type,
        status: "active",
        installedAt: new Date().toISOString()
      });
    }
  }

  // 9. Refrescar proyectos
  await monitoringStore.fetchProjects();

  alert("Combo comprado, proyecto creado e IoT instalados.");
  dialogVisible.value = false;

  router.push(`/projects/${savedProject.id}/devices`);
}

</script>


<style scoped>
.new-project-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}

.new-project-card {
  width: 100%;
  max-width: 1100px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  padding: 1rem;
}

/* HEADER */

.header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.header-icon {
  font-size: 2rem;
  color: #b22222;
}

.page-title {
  margin: 0;
  font-weight: 700;
  color: #111;
}

/* SECTION */

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #374151;
}

/* COMBO CARD */

.combo-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.combo-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 28px rgba(178,34,34,.25);
}

.combo-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.combo-content {
  padding: 0.9rem;
}

.combo-title {
  margin: 0 0 0.4rem 0;
  font-weight: 600;
  color: #111827;
}

.provider-text {
  font-size: 0.85rem;
  color: #6b7280;
}

/* BADGES */

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  margin-left: 0.4rem;
  font-weight: 700;
}

.badge.premium {
  background: linear-gradient(135deg, gold, orange);
  color: #000;
}

.badge.enterprise {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
}

/* PROVIDERS */

.provider-card {
  background: rgba(0,0,0,.75);
  border-radius: 14px;
  padding: 0.9rem;
  text-align: center;
  color: #fff;
  transition: transform 0.25s ease;
}

.provider-card:hover {
  transform: translateY(-4px);
}

.provider-card h4 {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}

.provider-card p {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* DIALOG */

.dialog-title {
  font-weight: 700;
  color: #111;
}

.dialog-desc {
  color: #555;
}

.select-address {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* ADDRESS LIST */

.address-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.address-list li {
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.address-list li:hover {
  background: #f1f5f9;
}
/* DIALOG */

.combo-dialog :deep(.p-dialog-content) {
  padding: 0;
  overflow: hidden;
  border-radius: 18px;
}

/* HERO */

.combo-detail-hero {
  position: relative;
  height: 220px;
}

.combo-detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.combo-detail-overlay h2 {
  margin: 0;
  font-weight: 700;
  color: #111;
}

/* BODY */

.combo-detail-body {
  padding: 1.2rem;
  color: #111;
}

.combo-detail-desc {
  color: #555;
  font-size: .95rem;
  margin-bottom: 1.2rem;
}

/* INFO GRID */

.combo-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.detail-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem;
  border-radius: 12px;
  background: #f3f4f6;
  font-size: 0.85rem;
}

.detail-box i {
  font-size: 1.2rem;
  color: #b22222;
}

.detail-box span {
  color: #6b7280;
}

.detail-box strong {
  display: block;
  font-weight: 700;
}

.price-box {
  background: rgba(178,34,34,.1);
}

/* ADDRESS */

.address-select {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1rem;
}

.address-btn {
  border-radius: 999px;
}

/* ACTIONS */

.combo-detail-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.buy-btn {
  border-radius: 12px;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
  box-shadow: 0 6px 16px rgba(178,34,34,.4);
}

/* BADGES */

.badge {
  width: fit-content;
  margin-top: 0.3rem;
  font-size: .7rem;
  padding: .15rem .6rem;
  border-radius: 999px;
  font-weight: 700;
}

.badge.premium {
  background: linear-gradient(135deg, gold, orange);
  color: #000;
}

.badge.enterprise {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
}
.combo-detail-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,.95));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  color: #dadada;
}.combo-dialog :deep(.p-dialog) {
   background: white !important;

 }
.combo-dialog :deep(.p-dialog) {
  background: white !important;
}


</style>
