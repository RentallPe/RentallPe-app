<template>
  <div class="dash-wrap">
    <pv-card class="dash-card">
      <template #title>
        <h2 class="page-title">{{ t('dashboard.welcome') }}</h2>
      </template>

      <template #content>
        <div class="grid grid-reset">
          <!-- My Properties -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.myProperties') }}</h3>
              <ul class="summary-list" v-if="user?.properties?.length">
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

          <!-- Latest Alerts -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.latestAlerts') }}</h3>
              <ul class="summary-list" v-if="latestAlerts?.length">
                <li v-for="a in latestAlerts" :key="a.id">
                  <span class="time">{{ formatDate(a.time) }}</span>
                  <span class="text-black">{{ a.message }}</span>
                </li>
              </ul>
              <router-link to="/alerts">
                <pv-button :label="t('dashboard.seeAlerts')" text />
              </router-link>
            </div>
          </div>

          <!-- Incidents -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.incidents') }}</h3>
              <ul class="summary-list" v-if="user?.incidents?.length">
                <li v-for="inc in user.incidents" :key="inc.id">
                  <p class="text-black">{{ inc.incNumber }}</p>
                  <small>{{ t('dashboard.status') }}: {{ inc.status }}</small>
                </li>
              </ul>
              <router-link to="/support">
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

.dash-wrap{
  --sbw: 260px;         
  --gutter: .75rem;    
  box-sizing: border-box;
  margin-left: 0;
  width: 100%;
  padding: 1rem;
  min-height: 100dvh;
  background: #f9fafb;
  overflow-x: hidden;  
}

@media (min-width: 993px){
  .dash-wrap{
    margin-left: var(--sbw);
    width: calc(100% - var(--sbw));
    padding: 2rem;
  }
}

.dash-card{
  width: min(100%, 1100px);
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}


.grid-reset{ margin-left: 0 !important; margin-right: 0 !important; }
.grid-reset > [class^="col-"],
.grid-reset > [class*=" col-"]{
  padding-left: var(--gutter) !important;
  padding-right: var(--gutter) !important;
  min-width: 0;  
}

.page-title{ font-size: 1.8rem; margin: 0; color:#000; }

.section{ padding: .5rem 0; }
.section-title{
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: .5rem;
  color:#b22222;
}

.summary-list{ list-style:none; padding:0; margin:0 0 .5rem 0; }
.summary-list li{
  display:flex; align-items:center; gap:.8rem;
  padding:.4rem 0; border-bottom:1px solid #eee;
}
.thumb{ width:40px; height:40px; border-radius:6px; object-fit:cover; flex: 0 0 40px; }
.text-black{ color:#000; }
.time{ font-size:.8rem; color:#666; min-width:84px; }


@media (max-width: 480px){
  .page-title{ font-size: 1.4rem; }
  .section-title{ font-size: 1rem; }
}
</style>
