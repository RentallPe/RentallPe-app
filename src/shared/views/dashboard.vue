<template>
  <div class="dash-wrap">
    <pv-card class="dash-card">
      <template #title>
        <h2 class="page-title">{{ t('dashboard.welcome') }}</h2>
      </template>

      <template #content>
        <div v-if="!loading" class="grid grid-reset">
          <!-- My Properties -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.myProperties') }}</h3>

              <ul class="summary-list" v-if="myProperties.length">
                <li v-for="p in myProperties.slice(0,3)" :key="p.id">
                  <img :src="p.image || ('https://picsum.photos/300/200?random=' + p.id)" class="thumb" />
                  <div>
                    <p class="text-black">{{ p.name || ('Property ' + p.id) }}</p>
                    <small>{{ p.address || '—' }}</small>
                  </div>
                </li>
              </ul>
              <div v-else class="empty-hint">
                {{ t('dashboard.noProperties') || 'Aún no registras propiedades.' }}
              </div>

              <router-link to="/my-properties">
                <pv-button :label="t('dashboard.viewAll')" text />
              </router-link>
            </div>
          </div>

          <!-- Latest Alerts -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.latestAlerts') }}</h3>

              <ul class="summary-list" v-if="latestAlerts.length">
                <li v-for="a in latestAlerts" :key="a._key">
                  <span class="time">{{ formatDate(a._date) }}</span>
                  <div>
                    <p class="text-black">
                      {{ a.message || a.text || a.title || 'Alerta' }}
                    </p>
                    <small>{{ a.propertyName }}</small>
                  </div>
                </li>
              </ul>
              <div v-else class="empty-hint">
                {{ t('dashboard.noAlerts') || 'Sin alertas recientes.' }}
              </div>

              <router-link to="/alerts">
                <pv-button :label="t('dashboard.seeAlerts')" text />
              </router-link>
            </div>
          </div>

          <!-- Incidents -->
          <div class="col-12 md:col-6 lg:col-4">
            <div class="section">
              <h3 class="section-title">{{ t('dashboard.incidents') }}</h3>

              <ul class="summary-list" v-if="incidents.length">
                <li v-for="inc in incidents.slice(0,3)" :key="inc.id">
                  <div>
                    <p class="text-black">#{{ inc.id }}</p>
                    <small>
                      {{ t('dashboard.status') }}: {{ inc.status || 'pending' }} •
                      {{ formatDate(inc.createdAt) }}
                    </small>
                    <br />
                    <small>{{ inc.description || '—' }}</small>
                  </div>
                </li>
              </ul>
              <div v-else class="empty-hint">
                {{ t('dashboard.noIncidents') || 'No hay incidentes.' }}
              </div>

              <router-link to="/support">
                <pv-button :label="t('dashboard.manageIncidents')" text />
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="loading">Loading…</div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRentalStore } from '@/Rental/application/rental-store';

const { t } = useI18n();
const rental = useRentalStore();

const saved = localStorage.getItem('currentUser');
const USER_ID = saved ? JSON.parse(saved).id : 1;

const loading = ref(true);


onMounted(async () => {
  await Promise.all([
    rental.fetchAll('users'),
    rental.fetchAll('properties'),
    rental.fetchAll('incidents'),
  ]);
  loading.value = false;
});


const user = computed(() => rental.getLocalById('users', USER_ID) || null);


const myProperties = computed(() => {
  const all = rental.list('properties').value || [];
  const uid = String(USER_ID);
  return all.filter(p => String(p.ownerId ?? p.userId) === uid);
});


const latestAlerts = computed(() => {
  const alerts = myProperties.value.flatMap(p => {
    const arr = Array.isArray(p.alerts) ? p.alerts : [];
    return arr.map((a, i) => ({
      ...a,
      propertyId: p.id,
      propertyName: p.name || `Property ${p.id}`,
      _date: a.createdAt || a.time || a.date || p.updatedAt || p.createdAt || Date.now(),
      _key: `${p.id}-${a.id ?? i}-${a.createdAt ?? a.time ?? i}`,
    }));
  });

  return alerts
      .sort((a, b) => new Date(b._date) - new Date(a._date))
      .slice(0, 3);
});


const incidents = computed(() => {
  const all = rental.list('incidents').value || [];
  return [...all].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
});

function formatDate(dateLike) {
  const d = new Date(dateLike);
  if (isNaN(+d)) return '—';
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
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

.empty-hint{ font-size:.9rem; color:#6b7280; margin:.3rem 0 .6rem; }
.loading{ padding:1rem 0; color:#111827; }

@media (max-width: 480px){
  .page-title{ font-size: 1.4rem; }
  .section-title{ font-size: 1rem; }
}
</style>
