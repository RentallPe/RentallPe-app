<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

const { t } = useI18n();

const providerStore = useProviderStore();
const userStore = useUserStore();
const monitoringStore = useMonitoringStore();

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

// 👉 Si necesitas combos del store
const combos = providerStore.combos;
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
                <h3 class="combo-title">{{ combo.name }}</h3>
                <p class="combo-description">{{ combo.description }}</p>
                <p><strong>{{ t("myCombos.price") }}:</strong> ${{ combo.price }}</p>
                <p><strong>{{ t("myCombos.installTime") }}:</strong> {{ combo.installDays }} {{ t("myCombos.days") }}</p>
                <p><strong>{{ t("myCombos.status") }}:</strong> {{ combo.status }}</p>

                <h4>{{ t("myCombos.devices") }}</h4>
                <ul>
                  <li v-for="d in combo.devices" :key="d.id">
                    {{ d.type }} - {{ d.status }}
                  </li>
                </ul>

                <h4>{{ t("myCombos.notifications") }}</h4>
                <ul>
                  <li v-for="n in combo.notifications" :key="n.id">
                    {{ n.message }} ({{ new Date(n.createdAt).toLocaleString("es-PE") }})
                  </li>
                </ul>

                <h4>{{ t("myCombos.readings") }}</h4>
                <ul>
                  <li v-for="r in combo.readings" :key="r.id">
                    {{ r.metricName }}: {{ r.value }} {{ r.unit }}
                  </li>
                </ul>

                <h4>{{ t("myCombos.workitems") }}</h4>
                <ul>
                  <li v-for="w in combo.workitems" :key="w.id">
                    {{ w.description }} - {{ w.status }}
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
</style>