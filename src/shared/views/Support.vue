<template>
  <div class="support-wrapper">
    <pv-card class="support-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-phone text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('support.title') }}</h2>
        </div>
      </template>

      <template #content>
        <!-- Teléfonos -->
        <h3 class="text-black mb-3">{{ t('support.phoneContacts') }}</h3>
        <pv-data-table :value="contacts" class="minimal-table">
          <pv-column field="department" :header="t('support.department')"></pv-column>
          <pv-column field="number" :header="t('support.number')"></pv-column>
        </pv-data-table>

        <!-- Incidentes -->
        <h3 class="text-black mb-3">{{ t('support.incidents') }}</h3>
        <pv-data-table :value="user.incidents" class="minimal-table mt-4">
          <pv-column field="incNumber" :header="t('support.incNumber')"></pv-column>
          <pv-column field="status" :header="t('support.status')">
            <template #body="slotProps">
              <span class="status pending">{{ slotProps.data.status }}</span>
            </template>
          </pv-column>
          <pv-column header="">
            <template #body="slotProps">
              <i class="pi pi-angle-right cursor-pointer" @click="showIncident(slotProps.data)"></i>
            </template>
          </pv-column>
        </pv-data-table>

        <!-- Botón registrar -->
        <div class="flex justify-content-end mt-4">
          <router-link to="/register-incident">
            <pv-button :label="t('support.registerIncident')" icon="pi pi-exclamation-triangle" severity="danger" />
          </router-link>
        </div>
      </template>
    </pv-card>

    <!-- Dialogo de detalle -->
    <pv-dialog v-model:visible="dialogVisible" :header="t('support.incidentDetail')" modal :style="{ width: '40vw' }">
      <p><strong>{{ t('support.incNumber') }}:</strong> {{ selectedIncident?.incNumber }}</p>
      <p><strong>{{ t('support.status') }}:</strong> {{ selectedIncident?.status }}</p>
      <p><strong>{{ t('support.date') }}:</strong> {{ formatDate(selectedIncident?.date) }}</p>
      <p><strong>{{ t('support.description') }}:</strong></p>
      <p>{{ selectedIncident?.description }}</p>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const contacts = ref([
  { department: "Lima", number: "265-1998" },
  { department: "Lima", number: "471-5978" },
  { department: "Ica", number: "265-1658" }
]);

const user = ref({ incidents: [] });
const dialogVisible = ref(false);
const selectedIncident = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/user");
  user.value = await res.json();
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function showIncident(incident) {
  selectedIncident.value = incident;
  dialogVisible.value = true;
}
</script>

<style scoped>
.support-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #eeeeee;
  min-height: 100vh;
}

.support-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
}

.text-black {
  color: #000;
}

.status.pending {
  color: #f76c6c;
  font-weight: 600;
}
/* Color corporativo */
:root {
  --brick-red: #f76c6c;
}

.minimal-table :deep(.p-datatable-thead > tr > th) {
  background: #f76c6c;
  color: #fff;
  font-weight: 600;
  border: none;
  padding: 0.75rem 1rem;
}


.minimal-table :deep(.p-datatable-tbody > tr > td) {
  background: #fff;
  color: #000;
  border: none;
  padding: 0.7rem 1rem;
}


.minimal-table :deep(.p-datatable-tbody > tr:hover > td) {
  background: #fafafa;
}


.minimal-table :deep(.p-datatable-tbody > tr + tr > td) {
  border-top: 1px solid #cfcfcf;
}

/* Estado pendiente en rojo ladrillo (consistente con tu diseño) */
.status.pending {
  color: #f76c6c;
  font-weight: 600;
}

</style>