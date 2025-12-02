<template>
  <div class="dash-wrap">
    <pv-card class="dash-card">
      <template #title>
        <h2 class="page-title">{{ t('dashboard.welcome') }}</h2>
      </template>

      <template #content>
        <div class="grid grid-reset">
          <!-- Vista para CUSTOMER -->
          <template v-if="currentUser?.role === 'customer'">
            <!-- KPIs -->
            <div class="col-12">
              <div class="kpi-grid">
                <div class="kpi-card fancy-hover">
                  <h4>{{ properties.length }}</h4>
                  <p>{{ t('dashboard.kpis.properties') }}</p>
                </div>
                <div class="kpi-card fancy-hover">
                  <h4>{{ pendingPayments.length }}</h4>
                  <p>{{ t('dashboard.kpis.pendingPayments') }}</p>
                </div>
                <div class="kpi-card fancy-hover">
                  <h4>{{ subscription?.plan || '—' }}</h4>
                  <p>{{ t('dashboard.kpis.subscription') }}</p>
                </div>
              </div>
            </div>

            <!-- Propiedad destacada -->
            <div class="col-12 md:col-6 lg:col-4">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.myProperties') }}</h3>
                <div v-if="properties?.length" class="featured-property">
                  <img :src="properties[0].image" class="featured-img" />
                  <h4 class="text-black">{{ properties[0].name }}</h4>
                  <small>{{ properties[0].address }}</small>
                </div>
                <router-link to="/my-properties">
                  <pv-button :label="t('dashboard.viewAll')" text />
                </router-link>
              </div>
            </div>

            <!-- Suscripción -->
            <div class="col-12 md:col-6 lg:col-4">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.subscription') }}</h3>
                <div v-if="subscription">
                  <p class="text-black">
                    <strong>{{ t('dashboard.currentPlan') }}:</strong>
                    {{ subscription.plan }}
                    <span class="sub-badge">{{ subscription.status }}</span>
                  </p>
                  <p class="text-black">
                    <strong>{{ t('dashboard.price') }}:</strong>
                    S/. {{ subscription.price }}
                  </p>
                </div>
                <router-link to="/subscription">
                  <pv-button :label="t('dashboard.manageSubscription')" text />
                </router-link>
              </div>
            </div>

            <!-- Pagos pendientes -->
            <div class="col-12 md:col-6 lg:col-4">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.pendingPayments') }}</h3>
                <ul class="summary-list" v-if="pendingPayments?.length">
                  <li v-for="pay in pendingPayments.slice(0,3)" :key="pay.id" class="summary-item">
                    <div>
                      <p class="text-black">{{ pay.propertyName }}</p>
                      <small>S/. {{ pay.amount }} — {{ formatDate(pay.date) }}</small>
                    </div>
                  </li>
                </ul>
                <router-link to="/billing">
                  <pv-button :label="t('dashboard.viewPayments')" text />
                </router-link>
              </div>
            </div>
          </template>

          <!-- Vista para PROVIDER -->
          <template v-else-if="currentUser?.role === 'provider'">
            <!-- KPIs -->
            <div class="col-12">
              <div class="kpi-grid">
                <div class="kpi-card fancy-hover">
                  <h4>{{ combos.length }}</h4>
                  <p>{{ t('dashboard.kpis.combos') }}</p>
                </div>
                <div class="kpi-card fancy-hover">
                  <h4>{{ pendingInstalls.length }}</h4>
                  <p>{{ t('dashboard.kpis.pendingInstalls') }}</p>
                </div>
                <div class="kpi-card fancy-hover">
                  <h4>{{ totalIncome }}</h4>
                  <p>{{ t('dashboard.kpis.income') }}</p>
                </div>
              </div>
            </div>

            <!-- Combos destacados -->
            <div class="col-12 md:col-6 lg:col-4">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.myCombos') }}</h3>
                <div v-if="combos?.length" class="featured-property">
                  <img :src="combos[0].image" class="featured-img" />
                  <h4 class="text-black">{{ combos[0].name }}</h4>
                  <small>{{ combos[0].description }}</small>
                </div>
                <router-link to="/my-combos">
                  <pv-button :label="t('dashboard.viewAll')" text />
                </router-link>
              </div>
            </div>

            <!-- Pendientes de aprobación -->
            <div class="col-12 md:col-6 lg:col-4">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.pendingApprovals') }}</h3>
                <ul class="summary-list" v-if="pendingInstalls?.length">
                  <li v-for="install in pendingInstalls.slice(0,3)" :key="install.id" class="summary-item">
                    <div>
                      <p class="text-black">{{ install.comboName }}</p>
                      <small>{{ formatDate(install.date) }}</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Gráfico de ingresos -->
            <div class="col-12">
              <div class="section fancy-card">
                <h3 class="section-title">{{ t('dashboard.incomeChart') }}</h3>
                <v-chart class="chart" :option="incomeChartOptions" autoresize />
              </div>
            </div>
          </template>
        </div>
      </template>
    </pv-card>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
// Stores principales
import { useUserStore } from "@/IAM/application/user.store.js";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store.js";
import { usePaymentStore } from "@/Rental/application/payment-store.js";
import { usePropertyStore } from "@/Property/application/property-store.js";

// Stores adicionales para provider
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

// vue-echarts
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import ECharts from "vue-echarts";

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);
const propertyStore = usePropertyStore();

const { t } = useI18n();
const userStore = useUserStore();
const subscriptionStore = useSubscriptionStore();
const paymentStore = usePaymentStore();
const providerStore = useProviderStore();
const monitoringStore = useMonitoringStore();
const currentUser = computed(() => userStore.user);

const properties = ref([]);
const subscription = ref(null);
const pendingPayments = ref([]);
const combos = ref([]);
const pendingInstalls = ref([]);
const totalIncome = ref(0);

const paymentChartOptions = ref({
  title: { text: "Pagos Pendientes" },
  tooltip: {},
  legend: { data: ["Monto"] },
  xAxis: { type: "category", data: [] },
  yAxis: { type: "value" },
  series: [{ name: "Monto", type: "bar", data: [] }]
});

onMounted(async () => {
  // Usuario
  await userStore.fetchUser();

  // Propiedades (solo customer)
  await propertyStore.fetchProperties();
  properties.value = (propertyStore.properties || []).filter(
      p => String(p.ownerId) === String(currentUser.value?.id)
  );

  // Suscripción (solo customer)
  await subscriptionStore.load(currentUser.value?.id);
  subscription.value = subscriptionStore.subscription;

  // Pagos
  await paymentStore.fetchPayments();
  pendingPayments.value = (paymentStore.payments || []).filter(
      p => (p.status || "").toLowerCase() !== "paid" &&
          String(p.customerId) === String(currentUser.value?.id)
  );

  // Combos del provider
  await providerStore.fetchCombos();
  combos.value = (providerStore.combos || []).filter(
      c => String(c.providerId) === String(currentUser.value?.providerId)
  );

  // Pendientes de aprobación/instalación → workitems en monitoring
  await monitoringStore.fetchWorkitems();
  pendingInstalls.value = (monitoringStore.workitems || []).filter(
      w => String(w.providerId) === String(currentUser.value?.providerId) &&
          (w.status || "").toLowerCase() === "pending"
  );

  // Ingresos totales del provider
  totalIncome.value = paymentStore.payments
      .filter(p => String(p.providerId) === String(currentUser.value?.providerId))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

});


function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
</script>


<style scoped>
/* ================= BASE ================= */
.dash-wrap {
  --sbw: 260px;
  margin-left: 0;
  width: 100%;
  padding: 1rem;
  min-height: 100dvh;
  background: linear-gradient(180deg, #f9fafb, #eef1f5);
  overflow-x: hidden;
}

@media (min-width: 993px) {
  .dash-wrap {
    margin-left: var(--sbw);
    width: calc(100% - var(--sbw));
    padding: 2rem;
  }
}

.dash-card {
  width: min(100%, 1120px);
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.08);
  padding: 1rem 1.5rem;
}

/* ================= TITULOS ================= */
.page-title {
  font-size: 1.9rem;
  margin: 0;
  color: #000;
  font-weight: 700;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: .6rem;
  color: #b22222;
  letter-spacing: .3px;
}

/* ================= TARJETAS ================= */
.fancy-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  transition: all .25s ease;
}

.fancy-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.12);
}

/* ================= KPI ================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.kpi-card {
  border-radius: 16px;
  padding: 1.2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff, #f3f4f6);
}

.kpi-card h4 {
  font-size: 1.8rem;
  margin: 0;
  color: #b22222;
  font-weight: 800;
}

.kpi-card p {
  margin: 0;
  color: #111;
  font-size: .85rem;
  opacity: .8;
}

/* ================= FEATURED PROPERTY ================= */
.featured-property {
  margin-bottom: 1rem;
}

.featured-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: .5rem;
}

.featured-property h4 {
  color: #000;
  margin: .3rem 0 0;
}

.featured-property small {
  color: #444;
}

/* ================= LISTAS ================= */
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 .5rem 0;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .55rem 0;
  border-bottom: 1px solid #ececec;
}

.summary-item p {
  margin: 0;
  color: #000;
  font-weight: 600;
}

.summary-item small {
  color: #444;
}

/* ================= TEXTO ================= */
.text-black {
  color: #000;
}

/* ================= GRAFICO ================= */
.chart {
  width: 100%;
  height: 320px;
  padding: 1rem;
}

/* ================= BADGE SUSCRIPCION ================= */
.sub-badge {
  background: #b22222;
  color: #fff;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: .7rem;
  font-weight: 600;
  margin-left: .4rem;
}

/* ================= BOTONES PRIME ================= */
:deep(.p-button.p-button-text) {
  color: #b22222 !important;
  font-weight: 600;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(178, 34, 34, 0.08);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.45rem;
  }

  .section-title {
    font-size: 1rem;
  }
}
</style>
