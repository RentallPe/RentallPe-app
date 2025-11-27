<template>
  <div class="billingp-wrapper">
    <!-- Top bar -->
    <div class="page-bar">
      <button class="icon-btn" @click="goBack" :aria-label="t('buttons.goHome')">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="title">{{ t('menu.billing') }}</h1>
      <button class="icon-btn ghost" aria-label="Profile">
        <i class="pi pi-user"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="content">
      <h2 class="subtitle">{{ t('billing.title') }}</h2>

      <div class="property-title" v-if="propertyName">
        {{ propertyName }}
      </div>

      <div v-if="loading" class="loading">Loading…</div>

      <div v-else>
        <!-- Tabla estilo figma -->
        <div class="table-wrap" v-if="rows.length">
          <div class="table">
            <!-- header -->
            <div class="thead">
              <div class="tr head-row">
                <div class="th">{{ L('Status', 'Estado') }}</div>
                <div class="th">{{ L('Description', 'Descripción') }}</div>
                <div class="th">{{ L('E.Date', 'F.Venc.') }}</div>
                <div class="th">{{ L('Total amount', 'Monto') }}</div>
                <div class="th center">{{ L('Details', 'Detalles') }}</div>
              </div>
            </div>
            <!-- body -->
            <div class="tbody">
              <div v-for="r in rows" :key="r.id" class="tr">
                <div class="td strong">{{ statusLabel(r.status) }}</div>
                <div class="td strong">{{ r.description || '—' }}</div>
                <div class="td">{{ formatDate(r.when) }}</div>
                <div class="td strong">
                  {{ formatMoney(r.amount) }}{{ r.currencySymbol }}
                </div>
                <div class="td center">
                  <button class="icon-link" @click="openDetail(r)" :aria-label="L('See details','Ver detalles')">
                    <i class="pi pi-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>
        </div>

        <div v-else class="empty">
          {{ L('No payments for this property.', 'No hay pagos para esta propiedad.') }}
        </div>
      </div>
    </div>

    <!-- Dialog Detalle -->
    <pv-dialog
        v-model:visible="showDialog"
        modal
        :dismissableMask="true"
        :draggable="false"
        :closeOnEscape="true"
        :style="{ width: '520px', maxWidth:'92vw' }"
        :breakpoints="{ '960px':'520px','640px':'92vw' }"
        :header="L('Details','Detalles')"
        class="dlg-root"
    >
      <div class="dlg">

        <div class="dlg-hr"></div>

        <div class="dlg-list">
          <div v-for="(it, i) in detailItems" :key="i" class="dlg-item">
            <span class="name">{{ it.label }}</span>
            <span class="price">{{ formatMoney(it.amount) }}{{ it.currencySymbol || selected?.currencySymbol }}</span>
          </div>
        </div>

        <button class="btn-continue" @click="showDialog=false">
          {{ L('Continue','Continuar') }}
        </button>
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useRentalStore } from '@/Rental/application/rental-store';

const route = useRoute();
const router = useRouter();
const rental = useRentalStore();
const { t, locale } = useI18n();

const loading = ref(true);
const showDialog = ref(false);
const selected = ref(null);

const localeTag = computed(() =>
    String(locale.value || '').startsWith('es') ? 'es-PE' : 'en-US'
);
const L = (en, es) => (String(locale.value || '').startsWith('es') ? es : en);

onMounted(async () => {
  await Promise.all([
    rental.fetchAll('payments'),
    rental.fetchAll('projects'),
    rental.fetchAll('properties'),
  ]);
  loading.value = false;
});

const payments   = rental.list('payments');
const projects   = rental.list('projects');
const properties = rental.list('properties');

const propId = computed(() => String(route.params.id || ''));

const projectToProperty = computed(() => {
  const map = new Map();
  for (const pr of (projects.value || [])) {
    if (pr?.id != null) map.set(String(pr.id), pr.propertyId != null ? String(pr.propertyId) : undefined);
  }
  return map;
});

const propertyName = computed(() => {
  const p = (properties.value || []).find(x => String(x.id) === propId.value);
  return p?.name || `Property ${propId.value}`;
});

function mapPayment(p) {
  const when = p.date || p.maturityDate || p.dueDate || p.createdAt || null;
  const symbol = p.currencySymbol || p.currency || (localeTag.value === 'es-PE' ? 'S$' : '$');

  return {
    id: p.id,
    status: (p.status || 'pending').toLowerCase(),
    description: p.description || inferDescription(p),
    installment: p.installment ?? 1,
    amount: Number(p.amount ?? 0),
    when,
    currencySymbol: symbol,
    details: Array.isArray(p.details) ? p.details : null,
  };
}

function inferDescription(p) {
  if (p.installment && p.installment > 1) return 'Membership';
  if (Number(p.amount) >= 200) return 'Installation';
  return 'Membership';
}

const rows = computed(() => {
  const list = payments.value || [];
  const filtered = list.filter(p => {
    const pid = p.propertyId != null ? String(p.propertyId)
        : (p.projectId != null ? projectToProperty.value.get(String(p.projectId)) : undefined);
    return pid === propId.value;
  });
  return filtered
      .map(mapPayment)
      .sort((a, b) => (+new Date(b.when || 0)) - (+new Date(a.when || 0)));
});

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
function statusLabel(st) {
  const s = String(st || '').toLowerCase();
  if (String(locale.value || '').startsWith('es')) {
    if (s === 'paid') return 'Pagado';
    if (s === 'pending') return 'Pendiente';
    return s || '—';
  }
  if (s === 'paid') return 'Paid';
  if (s === 'pending') return 'Pending';
  return s || '—';
}

const detailItems = computed(() => {
  const row = selected.value;
  if (!row) return [];
  if (Array.isArray(row.details) && row.details.length) {
    return row.details.map(d => ({
      label: d.label ?? d.name ?? '',
      amount: Number(d.amount ?? 0),
      currencySymbol: d.currencySymbol
    }));
  }
  return [
    { label: 'Wifi Camera',            amount: 40 },
    { label: '4 Occupancy Sensors',    amount: 120 },
    { label: '2 Smart Lock',           amount: 170 }
  ];
});

function openDetail(row) {
  selected.value = row;
  showDialog.value = true;
}

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/billing');
}
</script>

<style scoped>
.billingp-wrapper{
  --sbw: 260px;
  --gutter: .75rem;
  min-height: 100dvh;
  background: #fff;
  padding: 1.25rem;
  box-sizing: border-box;
}
@media (min-width: 993px){
  .billingp-wrapper{
    margin-left: var(--sbw);
    width: calc(100% - var(--sbw));
    padding: 2rem;
  }
}

.page-bar{
  display:flex; align-items:center; justify-content:space-between;
  max-width: 1100px; margin: 0 auto 1rem auto;
}
.title{ margin:0; font-size:2.2rem; font-weight:800; color:#000; }
.icon-btn{
  width:44px; height:44px; border:none; outline:none; cursor:pointer;
  border-radius:12px; background:#ff7a78; color:#000;
  display:grid; place-items:center; box-shadow: 0 1px 2px rgba(0,0,0,.08);
}
.icon-btn.ghost{ background:#ff7a78; }

.content{
  width: min(100%, 1100px);
  margin: 0 auto;
}
.subtitle{ margin:.25rem 0 0 0; font-size:1.8rem; color:#000; }
.property-title{ font-weight:800; font-size:1.25rem; color:#6b7280; margin:.75rem 0 .25rem; }

.table-wrap{ margin-top:.25rem; }
.table{ width:100%; display:block; }
.thead, .tbody{ width:100%; }
.tr{ display:grid; grid-template-columns: 1.2fr 1.8fr 1.2fr 1.2fr .7fr; align-items:center; gap:.5rem; }
.th, .td{ padding:.65rem .5rem; color:#333; }
.th{ font-weight:800; color:#fff; }
.thead .head-row{ background:#c96f65; border-radius: 20px; }
.tbody .tr{ border-bottom:1px solid #e1a39c; }
.tbody .tr:last-child{ border-bottom:none; }
.strong{ font-weight:700; }
.center{ text-align:center; }
.icon-link{
  background:transparent; border:none; cursor:pointer; color:#000; padding:.25rem .4rem; border-radius:8px;
}
.icon-link:hover{ background: rgba(0,0,0,.05); }

.divider{ height:4px; background:#c96f65; border-radius:8px; margin:.9rem 0 0; }
.empty{ color:#6b7280; padding:.75rem 0; }
.loading{ padding:1rem 0; color:#111827; }

:deep(.p-dialog){
  border-radius: 28px !important;
  overflow: hidden;
}
:deep(.p-dialog .p-dialog-header){
  display:none;
}
:deep(.p-dialog .p-dialog-content){
  padding: 0 !important;
  background: transparent;
}

.dlg{
  background:#fff;
  padding: 18px 22px 26px;
  border-radius: 28px;
  box-shadow: 0 6px 28px rgba(0,0,0,.12);
}
.dlg-title{
  font-size: 1.6rem;
  font-weight: 800;
  color:#000;
  margin: 0 0 .25rem 0;
}
.dlg-hr{
  height: 6px;
  width: 140px;
  background:#c96f65;
  border-radius: 6px;
  margin: 2px 0 10px;
}
.dlg-list{ margin: 8px 0 14px; }
.dlg-item{
  display:flex; align-items:center; justify-content:space-between;
  padding: 6px 6px;
  font-weight: 700;
  color:#4b5563;
}
.dlg-item + .dlg-item{ margin-top: 2px; }
.dlg-item .price{ color:#4b5563; }

.btn-continue{
  display:block; margin: 6px auto 0;
  padding: 10px 28px;
  font-weight:800; font-size:1.05rem;
  border:none; border-radius:14px;
  background:#ff7a78; color:#fff;
  cursor:pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
}
.btn-continue:hover{ filter: brightness(0.98); }
.btn-continue:active{ transform: translateY(1px); }

@media (max-width: 680px){
  .tr{ grid-template-columns: 1.1fr 1.7fr 1fr 1fr .6fr; }
  .subtitle{ font-size:1.4rem; }
}
</style>
