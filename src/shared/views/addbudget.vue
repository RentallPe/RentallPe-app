<template>
  <div class="wrap">
    <!-- Top bar -->
    <div class="topbar">
      <button class="icon-btn" @click="goBack" aria-label="Back">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="title">New Budget</h1>
      <button class="icon-btn ghost" aria-label="Profile">
        <i class="pi pi-user"></i>
      </button>
    </div>

    <div class="content">
      <!-- Select property -->
      <label class="lbl">Select Property:</label>
      <pv-dropdown
          v-model="selectedId"
          :options="propertyOptions"
          optionLabel="label"
          optionValue="value"
          :filter="true"
          showClear
          class="w-full dropdown"
          :placeholder="placeholderText"
      />

      <div v-if="selected" class="preview">
        <img :src="selected.image" class="thumb" alt="" />
        <div class="meta">
          <div class="name">{{ selected.name }}</div>
          <div class="addr">{{ selected.address }}</div>
        </div>
      </div>

      <div class="form">
        <h3 class="h3">Budget:</h3>

        <div class="field">
          <label class="small">Water</label>
          <div class="money">
            <span class="sign">{{ symbol }}</span>
            <input
                type="number"
                inputmode="numeric"
                min="0"
                step="1"
                v-model.number="water"
                :disabled="!selected"
                class="inp"
                placeholder="Max."
            />
          </div>
        </div>

        <div class="field">
          <label class="small">Electricity</label>
          <div class="money">
            <span class="sign">{{ symbol }}</span>
            <input
                type="number"
                inputmode="numeric"
                min="0"
                step="1"
                v-model.number="electricity"
                :disabled="!selected"
                class="inp"
                placeholder="Max."
            />
          </div>
        </div>

        <div class="alert-row">
          <label class="chk">
            <input type="checkbox" v-model="alertEnabled" :disabled="!selected" />
            <span>Receive an alert</span>
          </label>

          <div class="thresh">
            <span>When the usage is at</span>
            <input
                type="number"
                min="1"
                max="100"
                step="1"
                v-model.number="thresholdPct"
                :disabled="!selected || !alertEnabled"
                class="thresh-inp"
            />
            <span>%</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="cta" :disabled="!canAccept" @click="openConfirm">
          Accept
        </button>
        <button class="cta ghost" @click="goBack">Cancel</button>
      </div>
    </div>

    <div
        v-if="showConfirm"
        class="confirm-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmTitle"
        @keydown.esc="closeConfirm"
    >
      <div class="confirm-card">
        <button class="confirm-x" @click="closeConfirm" aria-label="Close">×</button>

        <h2 id="confirmTitle" class="confirm-title">
          <span>Creating a Budget for:</span>
          <i class="underline"></i>
        </h2>

        <div class="confirm-prop">
          <img :src="selected?.image" alt="" class="confirm-thumb" />
          <div class="confirm-meta">
            <div class="confirm-name">{{ selected?.name }}</div>
            <div class="confirm-addr">{{ selected?.address }}</div>
          </div>
        </div>

        <ul class="confirm-list">
          <li><b>Water:</b> {{ money(water) }}</li>
          <li><b>Electricity:</b> {{ money(electricity) }}</li>
          <li v-if="alertEnabled"><b>Alert:</b> Yes, at {{ thresholdPct }}%</li>
          <li v-else><b>Alert:</b> No</li>
        </ul>

        <div class="confirm-actions">
          <button class="btn btn-green" @click="confirmAndSave">Accept</button>
          <button class="btn btn-red" @click="closeConfirm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRentalStore } from '@/Rental/application/rental-store'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const rental = useRentalStore()
const { locale } = useI18n()

onMounted(async () => {
  await rental.fetchAll('properties')
})

const properties = rental.list('properties')

const selectedId = ref(null)
const propertyOptions = computed(() =>
    (properties.value || []).map(p => ({
      label: `${p.name}, ${p.address}`,
      value: p.id
    }))
)
const selected = computed(() =>
    (properties.value || []).find(p => String(p.id) === String(selectedId.value))
)

const symbol = '$'
const water = ref(null)
const electricity = ref(null)
const alertEnabled = ref(false)
const thresholdPct = ref(75)

const canAccept = computed(() => {
  if (!selected.value) return false
  const okWater = water.value !== null && water.value >= 0
  const okElec  = electricity.value !== null && electricity.value >= 0
  const okAlert = !alertEnabled.value || (thresholdPct.value >= 1 && thresholdPct.value <= 100)
  return okWater && okElec && okAlert
})

const showConfirm = ref(false)
function openConfirm () {
  if (!canAccept.value) return
  showConfirm.value = true
  document.body.style.overflow = 'hidden'
}
function closeConfirm () {
  showConfirm.value = false
  document.body.style.overflow = ''
}
onUnmounted(() => { document.body.style.overflow = '' })

const isES = computed(() => String(locale.value || '').startsWith('es'))
const money = (n) =>
    `${symbol}${Number(n ?? 0).toLocaleString(isES.value ? 'es-PE' : 'en-US', { maximumFractionDigits: 0 })}`

async function confirmAndSave () {
  await save()
}

async function save() {
  if (!selected.value) return
  try {
    const updated = {
      ...selected.value,
      budget: {
        water: Number(water.value ?? 0),
        electricity: Number(electricity.value ?? 0),
      },
      budgetAlert: {
        enabled: !!alertEnabled.value,
        pct: Number(thresholdPct.value ?? 0)
      }
    }
    await rental.update('properties', updated)
    closeConfirm()
    router.push('/consumption')
  } catch (e) {
    console.error('[addbudget] save error:', e)
    alert('Could not save the budget.')
  }
}

function goBack() {
  if (history.length > 1) router.back()
  else router.push('/consumption')
}

const placeholderText = 'Select...'
</script>

<style scoped>
.wrap{
  --sbw:260px;
  padding:1rem;
  min-height:100dvh;
  background:#fff;
}
@media (min-width: 993px){
  .wrap{ margin-left:var(--sbw); width:calc(100% - var(--sbw)); padding:2rem; }
}
.content{ width:min(100%,1100px); margin:0 auto; }

.topbar{ display:flex; align-items:center; justify-content:space-between; width:min(100%,1100px); margin:0 auto 1.25rem; }
.title{ margin:0; font-size:2.2rem; font-weight:800; color:#000; }
.icon-btn{ width:44px; height:44px; border:none; border-radius:12px; cursor:pointer; background:#ff7a78; color:#000; display:grid; place-items:center; }
.icon-btn.ghost{ background:#ff7a78; }

.lbl{ display:block; margin:.25rem 0 .6rem; color:#000; font-weight:700; font-size:1.1rem; }
.dropdown :deep(.p-dropdown){ width:min(100%,650px); }

.preview{ display:flex; align-items:center; gap:1rem; margin:1rem 0 0.5rem; }
.thumb{ width:200px; height:160px; object-fit:cover; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
.meta .name{ font-weight:800; color:#111; }
.meta .addr{ color:#6b7280; font-size:.95rem; }

.form{ margin-top:1rem; width:min(100%,650px); }
.h3{ margin:1rem 0 .6rem; color:#000; font-size:1.3rem; }
.field{ margin-bottom:.9rem; }
.small{ display:block; color:#555; margin-bottom:.25rem; }
.money{ position:relative; display:inline-flex; align-items:center; }
.sign{ position:absolute; left:.6rem; color:#666; user-select:none; pointer-events:none; }

.inp{
  padding:.55rem .8rem .55rem 1.4rem;
  border:1px solid #e5e7eb;
  border-radius:10px;
  min-width:180px;
  outline:none;
  background:#fff;
  color:#111;
  -webkit-text-fill-color:#111;
}
.inp::placeholder{ color:#9ca3af; }
.inp::-webkit-outer-spin-button,
.inp::-webkit-inner-spin-button{
  -webkit-appearance: inner-spin-button;
  opacity:1;
  height:auto;
}
.inp{ appearance:auto; -moz-appearance:auto; }
.inp:disabled{ background:#f5f5f5; color:#9ca3af; }

.alert-row{ display:flex; align-items:center; gap:1rem; flex-wrap:wrap; margin-top:.4rem; }
.chk{ display:inline-flex; align-items:center; gap:.5rem; color:#111; }
.thresh{ display:inline-flex; align-items:center; gap:.4rem; color:#555; }
.thresh-inp{
  width:64px; padding:.45rem .5rem; border:1px solid #e5e7eb; border-radius:10px;
}
.thresh-inp:disabled{ background:#f5f5f5; color:#9ca3af; }

.actions{ display:flex; gap:1rem; margin:1.4rem 0 0; }
.cta{
  padding:.9rem 1.3rem; border-radius:14px; border:none; cursor:pointer; font-weight:800;
  background:#22c55e; color:#fff; box-shadow:0 2px 6px rgba(0,0,0,.1);
}
.cta:disabled{ opacity:.45; cursor:not-allowed; }
.cta.ghost{ background:#ff7a78; color:#fff; }

.confirm-overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  backdrop-filter: blur(2px);
  display: grid; place-items: center;
  z-index: 9999;
}
.confirm-card{
  width: min(560px, 92vw);
  background: #fff;
  color: #111;
  border-radius: 28px;
  padding: 1.4rem 1.2rem 1.2rem;
  box-shadow: 0 10px 50px rgba(0,0,0,.25);
  position: relative;
}
.confirm-x{
  position:absolute; top:10px; right:12px;
  width:32px; height:32px; border:none; border-radius:10px;
  background: #ffe4e4; color:#000; font-size:20px; line-height:1;
  cursor:pointer;
}
.confirm-title{
  font-size: 1.6rem; font-weight: 800; margin: .2rem 0 1rem;
}
.confirm-title .underline{
  display:block; width:140px; height:4px; border-radius:999px;
  background:#ff7a78; margin-top:.35rem;
}
.confirm-prop{ display:flex; gap:1rem; align-items:center; margin-bottom:.6rem; }
.confirm-thumb{ width:120px; height:120px; object-fit:cover; border-radius:16px; }
.confirm-meta{ min-width:0; }
.confirm-name{ font-weight:800; margin-bottom:.25rem; }
.confirm-addr{ color:#6b7280; font-size:.95rem; }

.confirm-list{ list-style:none; padding:0; margin:.5rem 0 1.1rem; }
.confirm-list li{ padding:.2rem 0; }

.confirm-actions{ display:flex; gap:1rem; justify-content:center; }
.btn{
  border:none; cursor:pointer; border-radius:14px;
  font-weight:800; padding:.85rem 1.5rem; font-size:1rem;
}
.btn-green{ background:#22c55e; color:#fff; }
.btn-red{ background:#ff7a78; color:#fff; }

</style>
