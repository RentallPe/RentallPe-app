<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

const { t } = useI18n();

const providerStore = useProviderStore();
const userStore = useUserStore();
const monitoringStore = useMonitoringStore();

// Usuario actual desde localStorage
const saved = localStorage.getItem("currentUser");
const currentUser = saved ? JSON.parse(saved) : null;

onMounted(async () => {
await Promise.all([
providerStore.fetchCombos(),
monitoringStore.fetchProjects(),
monitoringStore.fetchDevices(),
monitoringStore.fetchNotifications(),
monitoringStore.fetchReadings(),
monitoringStore.fetchWorkitems()
]);
});

// 👉 Filtrar combos según el usuario
const combos = computed(() => {
if (!currentUser) return [];

// Si es proveedor, mostrar solo combos de su providerId
if (currentUser.role === "provider") {
return providerStore.combos.filter(
c => String(c.providerId) === String(currentUser.providerId)
);
}

// Si es cliente, podrías mostrar combos asociados a sus propiedades o compras
if (currentUser.role === "customer") {
// Aquí puedes ajustar la lógica según tu modelo de datos
return providerStore.combos.filter(
c => String(c.customerId) === String(currentUser.id)
);
}

// Si no aplica, devolver vacío
return [];
});
</script>


<template>
  <div class="combos-wrapper">
    <pv-card class="combo-card-container">
      <template #title>
        <h2 class="page-title">{{ t("myCombos.title") }}</h2>
      </template>

      <template #content>
        <div class="grid combo-grid grid-reset">
          <div
              v-for="combo in combos"
              :key="combo.id"
              class="col-12 md:col-6 lg:col-4 col-fix"
          >
            <pv-card class="combo-card">
              <template #header>
                <router-link :to="`/combo/${combo.id}`">
                  <img :src="combo.image" alt="Combo image" class="combo-img" />
                </router-link>
              </template>
              <template #content>
                <h3 class="combo-title">
                  {{ combo.name }}
                  <span :class="['plan-badge', combo.planType]"> {{ t('myCombos.planOptions.' + combo.planType) }}</span>
                </h3>
                <p class="combo-description">{{ combo.description }}</p>
                <p><strong>{{ t("myCombos.price") }}:</strong> ${{ combo.price }}</p>
                <p><strong>{{ t("myCombos.installTime") }}:</strong> {{ combo.installDays }} {{ t("myCombos.days") }}</p>
                <h4>{{ t("myCombos.devices") }}</h4>
                <ul>
                  <li v-for="d in combo.devices" :key="d">
                    {{ d }}
                  </li>
                </ul>

              </template>

            </pv-card>
          </div>
        </div>

        <div class="actions">
          <router-link to="/add-combo">
            <pv-button :label="t('myCombos.add')" icon="pi pi-plus" severity="primary" />
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>


<style scoped>
.combos-wrapper {
  --sbw:260px;
  margin-left: var(--sbw);
  width: calc(100% - var(--sbw));
  padding: 2rem;
  background: #f9fafb;
  min-height: 100dvh;
  box-sizing: border-box;
  overflow-x: clip;
}

.combo-card-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #111;
}

.grid-reset {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.grid-reset > [class*="col-"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.col-fix {
  min-width: 0;
}

.combo-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.combo-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}
.combo-title {
  margin: 0.5rem 0 0;
  font-weight: 600;
  color: #111;
}
.combo-description {
  color: #6b7280;
  margin: 0.25rem 0 0.5rem;
}

.actions {
  display: flex;
  justify-content: end;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .combos-wrapper {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
}
/* Forzar texto negro en todo el card */
.combo-card,
.combo-card h3,
.combo-card p,
.combo-card strong,
.combo-card span,
.combo-card li {
  color: #111 !important;
}

/* Badge de planType */
.plan-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.plan-badge.basic {
  background: #e5e7eb; /* gris */
  color: #111;
}

.plan-badge.premium {
  background: linear-gradient(135deg, gold, orange);
  color: #000;
}

.plan-badge.enterprise {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
}

</style>