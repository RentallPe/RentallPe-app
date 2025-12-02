<template>
  <div class="alerts-wrapper">
    <pv-card class="alerts-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-bell text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('alerts.title') }}</h2>
        </div>
      </template>

      <template #content>
        <div v-if="loading" class="empty-text">{{ t('alerts.loading') }}</div>

        <div v-else-if="error" class="empty-text">{{ t('alerts.error') }}: {{ error }}</div>

        <div v-else-if="!properties.length" class="empty-text">
          {{ t('alerts.noProperties') }}
        </div>


        <div
            v-for="property in properties"
            :key="property.id"
            class="property-alert"
        >
          <h3 class="property-title">{{ property.name || ('Property ' + property.id) }}</h3>
          <p class="property-address">{{ property.address }}</p>

          <!-- Mostrar cliente y combo si es provider -->
          <div v-if="currentUser.role === 'provider'" class="extra-info">
            <p><strong>Cliente:</strong> {{ property.customerName }}</p>
            <p><strong>Combo instalado:</strong> {{ property.comboName }}</p>
          </div>

          <h4 class="section-title">{{ t('alerts.latest') }}</h4>
          <ul class="alert-list" v-if="property.alerts && property.alerts.length">
            <li v-for="alert in property.alerts" :key="alert.id">
              <span class="alert-time">{{ formatDate(alert.time) }}</span>
              <span class="alert-message">{{ alert.message }}</span>
            </li>
          </ul>
          <p v-else class="empty-text">{{ t('alerts.noAlerts') }}</p>

          <h4 class="section-title">{{ t('alerts.lock') }}</h4>
          <ul class="lock-list" v-if="property.locks && property.locks.length">
            <li v-for="lock in property.locks" :key="lock.id">
              <span class="lock-time">{{ formatDate(lock.time) }}</span>
              <span class="lock-action">{{ lock.action }}</span>
            </li>
          </ul>
          <p v-else class="empty-text">{{ t('alerts.noLocks') }}</p>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePropertyStore } from "@/Property/application/property-store.js";
import { useRentalStore } from "@/Rental/application/rental-store.js"; // para pagos
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";

const { t } = useI18n();

const propertyStore = usePropertyStore();
const rentalStore = useRentalStore();
const providerStore = useProviderStore();
const userStore = useUserStore();

const loading = ref(true);
const error = ref("");

const savedUser = localStorage.getItem("currentUser");
const currentUser = savedUser ? JSON.parse(savedUser) : null;

onMounted(async () => {
  try {
    await Promise.all([
      propertyStore.fetchProperties(),
      rentalStore.fetchAll("payments"), // temporal, hasta tener payment-store
      providerStore.fetchCombos(),
      userStore.fetchUsers()
    ]);
  } catch (e) {
    console.error(e);
    error.value = e?.message || "No se pudieron cargar las propiedades";
  } finally {
    loading.value = false;
  }
});

const properties = computed(() => {
  const allProperties = propertyStore.properties || [];
  const allPayments = rentalStore.lists["payments"] || [];
  const combos = providerStore.combos || [];
  const users = userStore.users || [];

  if (currentUser?.role === "provider") {
    // propiedades donde el proveedor vendió combos
    const providerPayments = allPayments.filter(
        p => String(p.providerId) === String(currentUser.providerId)
    );

    return providerPayments.map(p => {
      const property = allProperties.find(pr => String(pr.id) === String(p.propertyId));
      const combo = combos.find(c => String(c.id) === String(p.comboId));
      const customer = users.find(u => String(u.id) === String(p.customerId));

      return {
        ...property,
        alerts: Array.isArray(property?.alerts) ? property.alerts : [],
        locks: Array.isArray(property?.locks) ? property.locks : [],
        customerName: customer?.fullName || "Unknown Customer",
        comboName: combo?.name || "Unknown Combo"
      };
    });
  }

  // caso customer (dueño de propiedades)
  return allProperties
      .filter(p => String(p.ownerId) === String(currentUser?.id))
      .map(p => ({
        ...p,
        alerts: Array.isArray(p.alerts) ? p.alerts : [],
        locks: Array.isArray(p.locks) ? p.locks : []
      }));
});

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
</script>


<style scoped>
.alerts-wrapper {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.alerts-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
}

.property-alert {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.property-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
}

.property-address {
  color: #555;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #b22222;
}

.alert-list,
.lock-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.alert-list li,
.lock-list li {
  display: flex;
  gap: 1rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.alert-time,
.lock-time {
  font-size: 0.85rem;
  color: #666;
  min-width: 150px;
}

.alert-message,
.lock-action {
  color: #000;
}

.empty-text {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}

.extra-info {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #333;
}
</style>