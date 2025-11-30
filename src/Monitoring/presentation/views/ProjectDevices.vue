<template>
  <div class="devices-wrapper">
    <pv-card class="devices-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-cog text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Project Devices</h2>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <h3 class="m-0 subtitle">Devices for {{ project?.name }}</h3>
        <div class="grid">
          <div
              v-for="device in projectDevices"
              :key="device.id"
              class="col-12 md:col-4"
          >
            <div class="device-card">
              <h3 class="device-title">{{ device.type }}</h3>
              <p>Status: {{ device.status }}</p>
              <p>Installed: {{ device.installedAt }}</p>

              <div class="flex gap-2 mt-2">
                <pv-button
                    label="Toggle"
                    icon="pi pi-power-off"
                    severity="info"
                    @click="toggleDevice(device)"
                />
                <pv-button
                    label="Details"
                    icon="pi pi-info-circle"
                    severity="secondary"
                    @click="viewDevice(device)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

const route = useRoute();
const monitoringStore = useMonitoringStore();

const projectId = Number(route.params.id);

// Proyecto actual
const project = computed(() =>
    monitoringStore.projects.find(p => p.id === projectId)
);

// Dispositivos del proyecto
const projectDevices = computed(() =>
    monitoringStore.iotDevices.filter(d => d.projectId === projectId)
);

// Acciones
function toggleDevice(device) {
  device.status = device.status === "active" ? "inactive" : "active";
  // Aquí podrías llamar a monitoringStore.updateDevice(device) si lo implementas
}

function viewDevice(device) {
  alert(`Device ${device.type} belongs to project ${device.projectId}`);
}
</script>

<style scoped>
.devices-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.devices-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.device-card {
  transition: transform 0.2s;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #eeeeee;
  padding: 1rem;
}

.device-card:hover {
  transform: scale(1.02);
  border-color: #b22222;
}

.device-title {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #111111;
}

.text-black {
  color: #000;
}
</style>