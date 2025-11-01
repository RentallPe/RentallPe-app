<template>
  <div class="billing-wrapper">
    <div class="page-bar">
      <button class="icon-btn" @click="goBack" :aria-label="t('buttons.goHome')">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="title">{{ t('menu.billing') }}</h1>
      <button class="icon-btn ghost" aria-label="Profile">
        <i class="pi pi-user"></i>
      </button>
    </div>

    <pv-card class="content-card">
      <template #title>
        <h2 class="subtitle">{{ t('billing.title') }}</h2>
      </template>

      <template #content>
        <div v-if="loading" class="loading">Loading…</div>

        <div v-else>
          <div v-if="pendingPayments.length" class="grid grid-reset">
            <div v-for="(p, idx) in pendingPayments" :key="idx" class="col-12 md:col-6 lg:col-4">
              <!-- CLICK navega por ID -->
              <div
                  class="bill-card clickable"
                  role="button"
                  :title="`${t('menu.billing')} - ${p.propertyName}`"
                  tabindex="0"
                  @click="goToProperty(p)"
                  @keydown.enter.prevent="goToProperty(p)"
                  @keydown.space.prevent="goToProperty(p)"
              >
                <div class="bill-line name">{{ p.propertyName }}</div>
                <div class="bill-line addr">{{ p.address }}</div>

                <div class="bill-line">
                  <strong>{{ t('billing.installment') }}:</strong>
                  {{ ordinalLocalized(p.installment) }}
                </div>
                <div class="bill-line">
                  <strong>{{ t('billing.amount') }}:</strong>
                  {{ p.currencySymbol }} {{ formatMoney(p.amount) }}
                </div>
                <div class="bill-line">
                  <strong>{{ t('billing.dueDate') }}:</strong>
                  {{ p.maturityDate }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty">
            {{ t('billing.noPending') || t('dashboard.noAlerts') || 'No pending payments.' }}
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRentalStore } from '@/Rental/application/rental-store';

const router = useRouter();
const rental = useRentalStore();
const { t, locale } = useI18n();

const saved = localStorage.getItem('currentUser');
const USER_ID = saved ? JSON.parse(saved).id : 1;

const loading = ref(true);

onMounted(async () => {
  await Promise.all([
    rental.fetchAll('users'),
    rental.fetchAll('payments'),
    rental.fetchAll('projects'),
    rental.fetchAll('properties'),
  ]);
  loading.value = false;
});

const payments   = rental.list('payments');
const projects   = rental.list('projects');
const properties = rental.list('properties');


const localeTag = computed(() =>
    String(locale.value || '').startsWith('es') ? 'es-PE' : 'en-US'
);
function formatDate(s) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(+d)
      ? String(s)
      : d.toLocaleDateString(localeTag.value, { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatMoney(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(localeTag.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function ordinalLocalized(n) {
  const v = Number(n ?? 0);
  if (String(locale.value || '').startsWith('es')) {
    if (!v) return '—';
    if (v === 1) return '1.ª';
    if (v === 2) return '2.ª';
    if (v === 3) return '3.ª';
    return `${v}.ª`;
  }
  const j = v % 10, k = v % 100;
  if (j === 1 && k !== 11) return v + 'st';
  if (j === 2 && k !== 12) return v + 'nd';
  if (j === 3 && k !== 13) return v + 'rd';
  return v + 'th';
}
function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}


const myPropertyIds = computed(() => {
  const uid = String(USER_ID);
  return new Set(
      (properties.value || [])
          .filter(p => String(p.ownerId ?? p.userId) === uid)
          .map(p => String(p.id))
  );
});
const projectToProperty = computed(() => {
  const map = new Map();
  for (const pr of (projects.value || [])) {
    if (pr?.id != null) map.set(String(pr.id), pr.propertyId != null ? String(pr.propertyId) : undefined);
  }
  return map;
});
const propertyInfo = computed(() => {
  const map = new Map();
  for (const p of (properties.value || [])) {
    if (p?.id != null) {
      map.set(String(p.id), { name: p.name || `Property ${p.id}`, address: p.address || '' });
    }
  }
  return map;
});


const pendingPayments = computed(() => {
  const ps = payments.value || [];
  const out = ps
      .filter(p => (p?.status || '').toLowerCase() !== 'paid')
      .map(p => {
        const propId = p.propertyId != null
            ? String(p.propertyId)
            : (p.projectId != null ? projectToProperty.value.get(String(p.projectId)) : undefined);

        if (!propId || !myPropertyIds.value.has(propId)) return null;

        const info = propertyInfo.value.get(propId) || { name: 'Property', address: '' };
        const dateLike = p.date || p.maturityDate || p.dueDate || p.createdAt;
        const symbol = p.currencySymbol || p.currency || (localeTag.value === 'es-PE' ? 'S/.' : '$');

        return {
          propertyId: propId,
          propertyName: info.name,
          address: info.address,
          installment: p.installment ?? 1,
          amount: Number(p.amount ?? 0),
          maturityDate: formatDate(dateLike),
          currencySymbol: symbol,
          _ts: dateLike ? +new Date(dateLike) : 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a._ts || 0) - (b._ts || 0));

  return out;
});

function goToProperty(p) {
  const id = encodeURIComponent(String(p.propertyId));
  router.push(`/billing/${id}`);
}
</script>

<style scoped>
.billing-wrapper{
  --sbw: 260px;
  --gutter: .75rem;
  background:#fff;
  min-height:100dvh;
  box-sizing:border-box;
  padding: 1.25rem;
}
@media (min-width: 993px){
  .billing-wrapper{
    margin-left: var(--sbw);
    width: calc(100% - var(--sbw));
    padding: 2rem;
  }
}

.page-bar{
  display:flex; align-items:center; justify-content:space-between;
  max-width: 1100px; margin: 0 auto 1rem auto;
}
.title{
  margin:0; font-size:2.2rem; font-weight:800; letter-spacing:.2px; color:#000;
}
.icon-btn{
  width:44px; height:44px; border:none; outline:none; cursor:pointer;
  border-radius:12px; background:#ff7a78; color:#000;
  display:grid; place-items:center; box-shadow: 0 1px 2px rgba(0,0,0,.08);
}
.icon-btn i{ font-size: 1.1rem; }
.icon-btn.ghost{ background:#ff7a78; }

.content-card{
  width: min(100%, 1100px);
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background:#fff;
}

.subtitle{
  margin: 0;
  padding-top:.25rem;
  font-size: 1.8rem;
  color:#000;
}

.grid-reset{ margin-left: 0 !important; margin-right: 0 !important; }
.grid-reset > [class^="col-"],
.grid-reset > [class*=" col-"]{
  padding-left: var(--gutter) !important;
  padding-right: var(--gutter) !important;
  min-width: 0;
}

.bill-card{
  background: #c96f65;
  color: #000;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
}
.bill-line{ margin-bottom: .55rem; line-height: 1.35; }
.bill-line:last-child{ margin-bottom: 0; }
.bill-line strong{ font-weight: 700; }
.bill-line.name{ font-weight:700; }
.bill-line.addr{ white-space:pre-line; }

.clickable{ cursor: pointer; transition: transform .08s ease, box-shadow .12s ease, background .12s ease; }
.clickable:hover{ transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,.1); background:#cf7a70; }
.clickable:active{ transform: translateY(0); }

.empty{
  color:#6b7280; padding: .75rem; font-size: .95rem;
}
.loading{ padding:1rem 0; color:#111827; }

@media (max-width: 480px){
  .title{ font-size:1.7rem; }
  .subtitle{ font-size:1.4rem; }
}
</style>
