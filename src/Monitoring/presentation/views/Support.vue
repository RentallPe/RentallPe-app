<template>
  <div class="support-wrap">
    <pv-card class="support-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-phone text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Support</h2>
        </div>
      </template>

      <template #content>
        <h3 class="text-black mb-3">Our phone contacts</h3>
        <div class="table-wrap">
          <pv-data-table :value="contacts" class="minimal-table">
            <pv-column field="department" header="Department" />
            <pv-column field="number" header="Number" />
          </pv-data-table>
        </div>

        <h3 class="text-black mb-3 mt-4">Incidents</h3>
        <div class="table-wrap">
          <pv-data-table :value="incidents" class="minimal-table">
            <pv-column field="id" header="INC number" />
            <pv-column header="Status">
              <template #body="{ data }">
                <span class="status pending">{{ data.status }}</span>
              </template>
            </pv-column>
            <pv-column header="">
              <template #body="{ data }">
                <i class="pi pi-angle-right cursor-pointer" @click="openIncident(data)" />
              </template>
            </pv-column>
          </pv-data-table>
        </div>

        <div class="flex justify-content-end mt-4">
          <router-link to="/register-incident">
            <pv-button label="Register incident" icon="pi pi-exclamation-triangle" severity="danger" />
          </router-link>
        </div>
      </template>
    </pv-card>

    <pv-dialog
      v-model:visible="dialogVisible"
      header="Incident detail"
      modal
      :style="{ width: 'min(90vw, 560px)' }"
    >
      <p><strong>INC:</strong> {{ selected?.id ?? '—' }}</p>
      <p><strong>Status:</strong> {{ selected?.status ?? '—' }}</p>
      <p><strong>Date:</strong> {{ formatDate(selected?.createdAt) }}</p>
      <p><strong>Description:</strong></p>
      <p>{{ selected?.description ?? '—' }}</p>
    </pv-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMonitoringStore } from '@/Monitoring/application/monitoring-store.js';

const store = useMonitoringStore();
onMounted(() => store.fetchIncidents());

// Mostrar todos los incidentes sin filtrar por usuario
const incidents = computed(() => store.incidents ?? []);

const dialogVisible = ref(false);
const selected = ref(null);

function openIncident(inc) {
  selected.value = inc;
  dialogVisible.value = true;
}

function formatDate(s) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(+d)
      ? String(s)
      : d.toLocaleString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
</script>



<style scoped>

.support-wrap{
  --sbw:260px;       
  box-sizing:border-box;
  margin-left:0;
  width:100%;
  padding:1rem;
  min-height:100dvh;
  background:#f9fafb;
  overflow-x:hidden; 
}


@media (min-width: 993px){
  .support-wrap{
    margin-left:var(--sbw);
    width:calc(100% - var(--sbw));
    padding:2rem;
  }
}

.support-card{
  width:min(100%, 1100px);
  margin:0 auto;
  background:#fff;
  border-radius:16px;
  overflow:hidden; 
}

.text-black{ color:#000; }

.table-wrap{
  width:100%;
  overflow-x:auto;           
  -webkit-overflow-scrolling: touch;
}


.minimal-table :deep(.p-datatable){ width:100%; }
.minimal-table :deep(.p-datatable-wrapper){ overflow:visible; }
.minimal-table :deep(table){
  width:100%;
  min-width:560px;          
  table-layout:fixed;       
  border-collapse:separate;
  border-spacing:0;
}
.minimal-table :deep(th),
.minimal-table :deep(td){
  word-break:break-word;
}

/* Estilo */
.minimal-table :deep(.p-datatable-thead > tr > th){
  background:#f76c6c;
  color:#fff;
  font-weight:600;
  border:none;
  padding:.75rem 1rem;
  white-space:nowrap;
}
.minimal-table :deep(.p-datatable-tbody > tr > td){
  background:#fff;
  color:#000;
  border:none;
  padding:.7rem 1rem;
}
.minimal-table :deep(.p-datatable-tbody > tr + tr > td){
  border-top:1px solid #e5e7eb;
}
.minimal-table :deep(.p-datatable-tbody > tr:hover > td){
  background:#fafafa;
}


.status.pending{ color:#f76c6c; font-weight:600; }


@media (max-width: 480px){
  .minimal-table :deep(th){ font-size:.9rem; }
  .minimal-table :deep(td){ font-size:.95rem; }
}
</style>

