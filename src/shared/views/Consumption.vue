<template>
  <div class="cons-wrap">
    <!-- Top bar -->
    <div class="topbar">
      <button class="icon-btn" @click="goBack" aria-label="Back">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="title">Consumption</h1>
      <button class="icon-btn ghost" aria-label="Profile">
        <i class="pi pi-user"></i>
      </button>
    </div>

    <!-- Content container -->
    <div class="content">
      <!-- Totals -->
      <h2 class="h2">Total:</h2>
      <div class="totals">
        <!-- Water total -->
        <div class="total-card">
          <div class="metric">Water</div>
          <div class="row">
            <div class="label">Used:</div>
            <div class="value">{{ money(sumWaterUsed, waterSymbol) }}</div>
            <div class="label right">Budget:</div>
            <div class="value">{{ money(sumWaterBudget, waterSymbol) }}</div>
          </div>
          <div class="bar">
            <div
                class="bar-fill water"
                :style="{ width: pct(sumWaterUsed, sumWaterBudget) + '%' }"
                :aria-valuenow="pct(sumWaterUsed, sumWaterBudget)"
            />
          </div>
        </div>

        <!-- Electricity total -->
        <div class="total-card">
          <div class="metric">Electricity</div>
          <div class="row">
            <div class="label">Used:</div>
            <div class="value">{{ money(sumElecUsed, elecSymbol) }}</div>
            <div class="label right">Budget:</div>
            <div class="value">{{ money(sumElecBudget, elecSymbol) }}</div>
          </div>
          <div class="bar">
            <div
                class="bar-fill elec"
                :style="{ width: pct(sumElecUsed, sumElecBudget) + '%' }"
                :aria-valuenow="pct(sumElecUsed, sumElecBudget)"
            />
          </div>
        </div>

        <router-link to="/consumption/all" class="view-all">
          View All →
        </router-link>
      </div>

      <!-- Cards grid -->
      <div class="grid">
        <div
            v-for="card in cards"
            :key="card.id"
            class="card"
        >
          <div class="header">
            <img :src="card.image" class="thumb" alt="" />
            <div class="meta">
              <div class="name">{{ card.name }}</div>
              <div class="addr">{{ card.address }}</div>
              <div class="tag">{{ monthYear(card.date) }}</div>
            </div>
          </div>

          <!-- Water -->
          <div class="metric mt">Water</div>
          <div class="row">
            <div class="label">Used:</div>
            <div class="value">{{ money(card.waterUsed, card.symbol) }}</div>
            <div class="label right">Budget:</div>
            <div class="value">{{ money(card.waterBudget, card.symbol) }}</div>
          </div>
          <div class="bar">
            <div
                class="bar-fill water"
                :style="{ width: pct(card.waterUsed, card.waterBudget) + '%' }"
            />
          </div>

          <!-- Electricity -->
          <div class="metric mt">Electricity</div>
          <div class="row">
            <div class="label">Used:</div>
            <div class="value">{{ money(card.elecUsed, card.symbol) }}</div>
            <div class="label right">Budget:</div>
            <div class="value">{{ money(card.elecBudget, card.symbol) }}</div>
          </div>
          <div class="bar">
            <div
                class="bar-fill elec"
                :style="{ width: pct(card.elecUsed, card.elecBudget) + '%' }"
            />
          </div>
        </div>
      </div>

      <!-- Bottom actions -->
      <div class="actions">
        <button class="cta ghost" @click="goManageBudget">
          <span>Manage budget</span>
          <span class="gear">⚙️</span>
        </button>
        <button class="cta" @click="goAddBudget">
          <span>Add budget</span>
          <span class="plus">＋</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRentalStore } from '@/Rental/application/rental-store'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const rental = useRentalStore()
const { locale } = useI18n()

const DEFAULT_BUDGET = { water: 200, electricity: 100 }

onMounted(async () => {
  await rental.fetchAll('properties')
})

const properties = rental.list('properties')

const isES = computed(() => String(locale.value || '').startsWith('es'))
const money = (n, symbol='$') =>
    `${symbol}${Number(n ?? 0).toLocaleString(isES.value ? 'es-PE' : 'en-US', { maximumFractionDigits: 0 })}`
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
const pct = (used, budget) => clamp(Math.round(((+used || 0) / Math.max(+budget || 1, 1)) * 100), 0, 100)
const monthYear = (s) => {
  if (!s) return ''
  const d = new Date(s)
  const fmt = new Intl.DateTimeFormat(isES.value ? 'es-PE' : 'en-US', { month: 'long', year: 'numeric' })
  const txt = fmt.format(d)
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}

/**
 * Normaliza un registro de consumo.
 * - Nuevo esquema: c.water { used, budget }, c.electricity { used, budget }, currencySymbol a nivel del registro.
 * - Compatibilidad: si viene formato viejo, calcula used y budget con fallback.
 */
function normalizeConsumption(c, prop) {
  const symbol = c?.currencySymbol || '$'

  if (c?.water && typeof c.water === 'object' && c?.electricity && typeof c.electricity === 'object') {
    return {
      date: c.date || c.createdAt || null,
      symbol,
      water: {
        used:   Number(c.water.used   ?? 0),
        budget: Number(c.water.budget ?? DEFAULT_BUDGET.water)
      },
      electricity: {
        used:   Number(c.electricity.used   ?? 0),
        budget: Number(c.electricity.budget ?? DEFAULT_BUDGET.electricity)
      }
    }
  }

  const waterUsed = Number(c?.water ?? (String(c?.type).toLowerCase() === 'water' ? c?.amount : 0) ?? 0)
  const elecUsed  = Number(c?.electricity ?? (String(c?.type).toLowerCase() === 'electricity' ? c?.amount : 0) ?? 0)

  const rootBudget = prop?.budget || {}
  const waterBudget = Number(rootBudget.water ?? DEFAULT_BUDGET.water)
  const elecBudget  = Number(rootBudget.electricity ?? DEFAULT_BUDGET.electricity)

  return {
    date: c?.date || c?.createdAt || null,
    symbol,
    water: { used: waterUsed, budget: waterBudget },
    electricity: { used: elecUsed, budget: elecBudget }
  }
}

function lastConsumption(prop) {
  const arr = Array.isArray(prop?.consumptions) ? [...prop.consumptions] : []
  if (!arr.length) {
    return {
      date: null,
      symbol: '$',
      water: { used: 0, budget: DEFAULT_BUDGET.water },
      electricity: { used: 0, budget: DEFAULT_BUDGET.electricity }
    }
  }
  arr.sort((a, b) => (+new Date(b.date || b.createdAt || 0)) - (+new Date(a.date || a.createdAt || 0)))
  return normalizeConsumption(arr[0], prop)
}

const cards = computed(() => {
  return (properties.value || []).map(p => {
    const c = lastConsumption(p)
    return {
      id: p.id,
      name: p.name || `Property ${p.id}`,
      address: p.address || '',
      image: p.image || `../../../public/images/logo-rentalpe.png`,
      date: c.date,
      symbol: c.symbol || '$',

      waterUsed: c.water.used,
      waterBudget: c.water.budget,

      elecUsed: c.electricity.used,
      elecBudget: c.electricity.budget
    }
  })
})

const sumWaterUsed   = computed(() => cards.value.reduce((a, b) => a + (b.waterUsed   || 0), 0))
const sumWaterBudget = computed(() => cards.value.reduce((a, b) => a + (b.waterBudget || 0), 0))
const sumElecUsed    = computed(() => cards.value.reduce((a, b) => a + (b.elecUsed    || 0), 0))
const sumElecBudget  = computed(() => cards.value.reduce((a, b) => a + (b.elecBudget  || 0), 0))
const waterSymbol    = computed(() => cards.value[0]?.symbol || '$')
const elecSymbol     = waterSymbol

function goBack() {
  if (history.length > 1) router.back()
  else router.push('/dashboard')
}
function goManageBudget() {
  router.push('/consumption/managebudget')
}
function goAddBudget() {
  router.push('/consumption/addbudget')
}

</script>

<style scoped>
.cons-wrap{
  --sbw: 260px;
  --gutter: 1rem;
  background:#fff;
  min-height:100dvh;
  padding: 1rem;
}
@media (min-width: 993px){
  .cons-wrap{ margin-left: var(--sbw); width: calc(100% - var(--sbw)); padding: 2rem; }
}
.content{ width:min(100%, 1100px); margin:0 auto; }

.topbar{ display:flex; align-items:center; justify-content:space-between; width:min(100%, 1100px); margin:0 auto 1rem; }
.title{ margin:0; font-size:2.2rem; font-weight:800; color:#000; }
.icon-btn{
  width:44px; height:44px; border:none; border-radius:12px; cursor:pointer;
  background:#ff7a78; color:#000; display:grid; place-items:center;
}
.icon-btn.ghost{ background:#ff7a78; }

.h2{ margin:.25rem 0 1rem; font-size:1.6rem; color:#000; }
.totals{
  display:grid; grid-template-columns: 1fr 1fr auto; gap: 2rem 2.5rem; align-items:end; margin-bottom: 1.25rem;
}
.total-card .metric{ font-weight:800; color:#555; margin-bottom:.5rem; }
.row{ display:grid; grid-template-columns: auto auto 1fr auto auto; gap:.5rem; align-items:center; }
.row .label{ color:#666; font-weight:600; }
.row .label.right{ justify-self:end; }
.row .value{ color:#000; font-weight:800; }
.bar{
  width:100%; height:14px; background:#e5e7eb; border-radius:9999px; overflow:hidden; margin-top:.35rem;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.04);
}
.bar-fill{ height:100%; }
.bar-fill.water{ background:#24b4ff; }
.bar-fill.elec{ background:#ffe34c; }

.view-all{
  align-self:start; justify-self:end; text-decoration:none; color:#000; font-weight:700; margin-bottom:.4rem;
}

.grid{
  display:grid; grid-template-columns: 1fr 1fr; gap:2rem;
}
@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
}
.card{
  border-radius:20px; background:#fff; padding: .75rem 1rem 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.05);
}
.header{ display:flex; gap:1rem; align-items:center; margin-bottom:.5rem; }
.thumb{ width:144px; height:144px; object-fit:cover; border-radius:16px; flex:0 0 144px; }
.meta{ min-width:0; }
.name{ font-weight:800; color:#111; }
.addr{ font-size:.86rem; color:#6b7280; }
.tag{ margin-top:.6rem; font-size:.82rem; color:#777; text-align:right; }

.metric{ font-weight:800; color:#555; }
.mt{ margin-top:.85rem; }

.actions{
  display:flex; gap:1.5rem; justify-content:center; align-items:center; margin: 1.4rem 0 0;
  flex-wrap: wrap;
}
.cta{
  display:flex; align-items:center; gap:.6rem;
  padding:.9rem 1.3rem; border-radius:16px; border:none; cursor:pointer;
  background:#ff7a78; color:#fff; font-weight:800; box-shadow:0 2px 6px rgba(0,0,0,.1);
}
.cta.ghost{ background:#fff; color:#000; border:1px solid #e5e7eb; }
.cta .plus{ font-size:1.25rem }
.cta .gear{ font-size:1.25rem }
</style>
