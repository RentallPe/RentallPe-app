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
              v-for="combo in visibleCombos"
              :key="combo.id"
              class="col-12 md:col-4"
              @click="selectCombo(combo)"
          >
            <div class="combo-card cursor-pointer">
              <img :src="combo.image" alt="" class="combo-img" />
              <h3 class="combo-title">
                {{ combo.name }}

                <span v-if="combo.planType === 'premium'" class="badge-premium">Premium</span>
                <span v-if="combo.planType === 'enterprise'" class="badge-enterprise">Enterprise</span>

              </h3>
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
const properties = computed(() => propertyStore.properties || []);
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
  // 1. Validar que haya una propiedad seleccionada
  if (!selectedAddress.value || !selectedAddress.value.id) {
    alert("Selecciona una propiedad válida primero.");
    return;
  }

  // 2. Validar plan de suscripción
  const sub = subscriptionStore.subscription;
  // Bloqueo para combos Premium
  if (sub?.plan !== "premium" && selectedCombo.value.planType === "premium") {
    alert("Debes tener plan Premium para este combo.");
    return;
  }
  // Bloqueo para combos Enterprise
  if (selectedCombo.value.planType === "enterprise") {
    alert("Los combos Enterprise no se pueden comprar con tu suscripción actual.");
    return;
  }

  // 1. Actualizar propiedad con combo
  const updatedProperty = {
    ...selectedAddress.value,
    combos: [...(selectedAddress.value.combos || []), selectedCombo.value]
  };
  await propertyStore.updateProperty(updatedProperty);

  // 2. Crear pago
  const currentUser = userStore.user;
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
  await paymentStore.createPayment(newPayment);

  // 3. Crear proyecto en Monitoring
  const newProject = {
    id: Date.now(),
    propertyId: updatedProperty.id,
    userId: currentUser.id,
    name: `Proyecto ${selectedCombo.value.name}`,
    description: `Instalación de ${selectedCombo.value.name}`,
    status: "active",
    startDate: new Date().toISOString(),
    endDate: null,
    createdAt: new Date().toISOString()
  };
  await monitoringStore.createProject(newProject);

  // 4. Instalar dispositivos IoT asociados al combo
  if (Array.isArray(selectedCombo.value.devices)) {
    for (const d of selectedCombo.value.devices) {
      await monitoringStore.createDevice({
        id: Date.now(),
        projectId: newProject.id,
        type: d.type,
        status: "active",
        installedAt: new Date().toISOString()
      });
    }
  }

  alert("Combo comprado, proyecto creado e IoT instalados.");
  dialogVisible.value = false;
  router.push(`/projects/${newProject.id}/devices`);

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
.badge-premium {
  background: gold;
  color: #000;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
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
.badge-enterprise {
  background: #3333cc;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

</style>