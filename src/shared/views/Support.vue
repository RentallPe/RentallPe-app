<template>
  <div class="support-wrapper">
    <pv-card class="support-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-phone text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Support</h2>
        </div>
      </template>

      <template #content>
        <!-- Teléfonos -->
        <h3 class="text-black mb-3">Our phone contacts</h3>
        <pv-data-table :value="contacts" class="minimal-table">
          <pv-column field="department" header="Department"></pv-column>
          <pv-column field="number" header="Number"></pv-column>
        </pv-data-table>

        <!-- Incidentes -->
        <h3 class="text-black mb-3">Incidents</h3>
        <pv-data-table :value="incidents" class="minimal-table mt-4">
          <pv-column field="id" header="INC number"></pv-column>
          <pv-column field="status" header="Status">
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
            <pv-button label="Register incident" icon="pi pi-exclamation-triangle" severity="danger" />
          </router-link>
        </div>
      </template>
    </pv-card>

    <!-- Dialogo de detalle -->
    <pv-dialog v-model:visible="dialogVisible" header="Incident detail" modal :style="{ width: '40vw' }">
      <p><strong>INC:</strong> {{ selectedIncident?.id }}</p>
      <p><strong>Status:</strong> {{ selectedIncident?.status }}</p>
      <p><strong>Date:</strong> {{ formatDate(selectedIncident?.createdAt) }}</p>
      <p><strong>Description:</strong></p>
      <p>{{ selectedIncident?.description }}</p>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { IncidentAssembler } from "@/Rental/infrastructure/incident.assembler.js";

const contacts = ref([
  { department: "Lima", number: "265-1998" },
  { department: "Lima", number: "471-5978" },
  { department: "Ica", number: "265-1658" }
]);

const incidents = ref([]);
const dialogVisible = ref(false);
const selectedIncident = ref(null);

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/incidents");
  incidents.value = IncidentAssembler.toEntitiesFromResponse(res);
});

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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