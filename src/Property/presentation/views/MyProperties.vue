<script setup>
import { onMounted, computed } from "vue";
import { usePropertyStore } from "@/Property/application/property-store.js";

const store = usePropertyStore();
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const properties = computed(() => {
  return store.properties
      .filter(p => String(p.ownerId) === String(currentUser.id))
      .map(p => ({
        ...p,
        image: p.image || `https://picsum.photos/800/600?random=${p.id ?? Math.random()}`,
        name: p.name ?? "New Property",
        address: p.address ?? "—",
        province: p.province ?? "—",
        region: p.region ?? "—",
        status: p.status ?? "—",
        handoverDate: p.handoverDate ?? "Not defined",
        progress: Number.isFinite(p.progress) ? p.progress : 0
      }));
});

onMounted(async () => {
  await store.fetchProperties();
});
</script>


<template>
  <div class="properties-wrapper">
    <pv-card class="new-project-card">
      <template #title>
        <h2 class="page-title">My Properties</h2>
      </template>

      <template #content>
        <div class="grid property-grid grid-reset">
          <div
            v-for="property in properties"
            :key="property.id"
            class="col-12 md:col-6 lg:col-4 col-fix"
          >
            <pv-card class="property-card">
              <template #header>
                <router-link :to="`/property/${property.id}`">
                  <img :src="property.image" alt="Property image" class="property-img" />
                </router-link>
              </template>
              <template #content>
                <h3 class="property-title">{{ property.name }}</h3>
                <p class="property-address">{{ property.address }}</p>
                <p><strong>Province:</strong> {{ property.province }}</p>
                <p><strong>Region:</strong> {{ property.region }}</p>
                <p><strong>Status:</strong> {{ property.status }}</p>
                <p><strong>Handover date:</strong> {{ property.handoverDate }}</p>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: property.progress + '%' }"></div>
                </div>
                <p>{{ property.progress }}% completed</p>
              </template>
            </pv-card>
          </div>
        </div>

        <div class="actions">
          <router-link to="/add-property">
            <pv-button label="Add property" icon="pi pi-plus" severity="primary" />
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

.properties-wrapper{
  --sbw:260px;
  margin-left:var(--sbw);
  width:calc(100% - var(--sbw));
  padding:2rem;
  background:#f9fafb;
  min-height:100dvh;
  box-sizing:border-box;
  overflow-x:clip;
}

.new-project-card{ width:100%; max-width:1000px; margin:0 auto; border-radius:16px; overflow:hidden; background:#fff; }
.page-title{ font-size:1.8rem; margin-bottom:1.5rem; color:#111; }


.grid-reset{ margin-left:0 !important; margin-right:0 !important; }
.grid-reset > [class*="col-"]{ padding-left:0 !important; padding-right:0 !important; }
.col-fix{ min-width:0; }


.property-card{ border-radius:12px; overflow:hidden; background:#fff; }
.property-img{ width:100%; height:220px; object-fit:cover; display:block; }
.property-title{ margin:.5rem 0 0; font-weight:600; color:#111; }
.property-address{ color:#6b7280; margin:.25rem 0 .5rem; }


.progress-bar{ background:#eee; border-radius:8px; height:8px; margin:.5rem 0; overflow:hidden; }
.progress-fill{ height:100%; border-radius:8px; background:#b22222; }


.actions{ display:flex; justify-content:end; margin-top:1rem; }


@media (max-width:1024px){
  .properties-wrapper{ margin-left:0; width:100%; padding:1rem; }
}
</style>
