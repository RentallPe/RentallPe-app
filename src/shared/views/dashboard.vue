<template>
  <div class="dashboard-wrapper">
    <pv-card class="dashboard-card">
      <template #title>
        <h2 class="page-title">{{ t('dashboard.welcome') }}</h2>
      </template>

      <template #content>
        <div class="grid">
          <!-- Mis propiedades -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.myProperties') }}</h3>
              <ul class="summary-list">
                <li v-for="p in user.properties.slice(0,3)" :key="p.id">
                  <img :src="p.image" class="thumb" />
                  <div>
                    <p class="text-black">{{ p.name }}</p>
                    <small>{{ p.address }}</small>
                  </div>
                </li>
              </ul>
              <router-link to="/my-properties">
                <pv-button :label="t('dashboard.viewAll')" text />
              </router-link>
            </div>
          </div>

          <!-- Últimas alertas -->
          <div class="col-12 md:col-6 lg:col-3">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.latestAlerts') }}</h3>
              <ul class="summary-list">
                <li v-for="alert in latestAlerts" :key="alert.id">
                  <span class="time">{{ formatDate(alert.time) }}</span>
                  <span class="text-black">{{ alert.message }}</span>
                </li>
              </ul>
              <router-link to="/alerts">
                <pv-button :label="t('dashboard.seeAlerts')" text />
              </router-link>
            </div>
          </div>

          <!-- Pagos pendientes -->
          <div class="col-12 md:col-6 lg:col-3">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.pendingPayments') }}</h3>
              <ul class="summary-list">
                <li v-for="pay in pendingPayments.slice(0,3)" :key="pay.id">
                  <p class="text-black">{{ pay.propertyName }}</p>
                  <small>{{ t('dashboard.amount') }}: ${{ pay.amount }} | {{ t('dashboard.due') }}: {{ pay.date }}</small>
                </li>
              </ul>
              <router-link to="/billing">
                <pv-button :label="t('dashboard.goToBilling')" text />
              </router-link>
            </div>
          </div>

          <!-- Incidentes -->
          <div class="col-12 md:col-6 lg:col-3">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.incidents') }}</h3>
              <ul class="summary-list">
                <li v-for="inc in user.incidents" :key="inc.id">
                  <p class="text-black">{{ inc.incNumber }}</p>
                  <small>{{ t('dashboard.status') }}: {{ inc.status }}</small>
                </li>
              </ul>
              <router-link to="/alerts">
                <pv-button :label="t('dashboard.manageIncidents')" text />
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";


const { t } = useI18n();
const user = ref({ properties: [], incidents: [] });
const pendingPayments = ref([]);
const latestAlerts = ref([]);

onMounted(async () => {
  const data = await getUser();
  user.value = data;

  pendingPayments.value = data.payments || [
    { id: 1, propertyName: "Urban Cottage", amount: 1200, date: "12/11/2025" },
    { id: 2, propertyName: "Hillside Home", amount: 3000, date: "20/11/2025" }
  ];

  latestAlerts.value = data.properties.flatMap(p => p.alerts || []).slice(0, 3);
});


function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
</script>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}
.dashboard-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}
.page-title {
  font-size: 1.8rem;
  margin: 0;
  color: #000;
}
.section {
  padding: 0.5rem 0;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #b22222;
}
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
}
.summary-list li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}
.thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}
.text-black {
  color: #000;
}
.time {
  font-size: 0.8rem;
  color: #666;
  min-width: 80px;
}
.p-card{
  color: #2b2b2b;
}
</style>