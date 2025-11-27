<template>
  <div class="wrap">
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

    <div class="content">
      <div class="grid">
        <div
            v-for="p in cards"
            :key="p.id"
            class="cell"
        >
          <router-link
              class="detail"
              :to="detailPath(p.id)"
              aria-label="Detail"
          >
            Detail →
          </router-link>

          <div class="row">
            <img :src="p.image" class="thumb" alt="" />
            <div class="meta">
              <div class="name">{{ p.name }}</div>
              <div class="addr">{{ p.address }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRentalStore } from '@/Rental/application/rental-store'

const router = useRouter()
const rental = useRentalStore()

onMounted(async () => {
  await rental.fetchAll('properties')
})

const properties = rental.list('properties')

const cards = computed(() =>
    (properties.value || []).map(p => ({
      id: p.id,
      name: p.name || `Property ${p.id}`,
      address: p.address || '',
      image: p.image || '/images/logo-rentalpe.png',
    })),
)

const detailPath = id => `/consumption/managebudget/${encodeURIComponent(id)}`

function goBack () {
  if (history.length > 1) router.back()
  else router.push('/consumption')
}
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

.topbar{
  display:flex; align-items:center; justify-content:space-between;
  width:min(100%,1100px); margin:0 auto 1.25rem;
}
.title{ margin:0; font-size:2.2rem; font-weight:800; color:#000; }
.icon-btn{
  width:44px; height:44px; border:none; border-radius:12px; cursor:pointer;
  background:#ff7a78; color:#000; display:grid; place-items:center;
}
.icon-btn.ghost{ background:#ff7a78; }

.grid{
  display:grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem 3.5rem;
}
@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
}
.cell{ display:flex; flex-direction:column; gap:.6rem; }
.detail{
  align-self:flex-start;
  color:#000; text-decoration:none; font-weight:700;
}
.row{
  display:flex; gap:1rem; align-items:center;
}
.thumb{
  width:130px; height:130px; object-fit:cover; border-radius:18px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  flex:0 0 130px;
}
.meta{ min-width:0; }
.name{ font-weight:800; color:#111; margin-bottom:.15rem; }
.addr{ color:#6b7280; font-size:.95rem; line-height:1.2; }
</style>
