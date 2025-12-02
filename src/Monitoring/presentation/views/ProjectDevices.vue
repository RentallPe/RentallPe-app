<template>
  <div class="devices-wrapper">
    <pv-card class="devices-card">
      <!-- Título -->
      <template #title>
        <div class="header">
          <div class="header-left">
            <i class="pi pi-microchip text-primary text-2xl"></i>
            <div>
              <h2 class="title">{{ t('devices.title') }}</h2>
              <p class="subtitle">{{ t('devices.subtitle') }} {{ project?.name }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <div v-if="projectDevices.length === 0" class="empty-state">
          <i class="pi pi-inbox empty-icon"></i>
          <p>{{ t('devices.noDevices') }}</p>
        </div>

        <div v-else class="grid device-grid">
          <div
              v-for="device in projectDevices"
              :key="device.id"
              class="col-12 md:col-4"
          >
            <div class="device-card">
              <div class="device-header">
                <h3 class="device-title">{{ device.type }}</h3>
                <span
                    class="status-badge"
                    :class="device.status === 'active' ? 'active' : 'inactive'"
                >
                  {{ t('devices.status.' + device.status) }}
                </span>
              </div>

              <div class="device-body">
                <p><strong>{{ t('devices.installed') }}:</strong> {{ device.installedAt }}</p>

                <div class="actions">
                  <pv-button
                      :label="t('devices.toggle')"
                      icon="pi pi-power-off"
                      severity="info"
                      size="small"
                      @click="toggleDevice(device)"
                  />
                  <pv-button
                      :label="t('devices.details')"
                      icon="pi pi-info-circle"
                      severity="secondary"
                      size="small"
                      @click="viewDevice(device)"
                  />
                </div>
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
import { useI18n } from "vue-i18n";
const route = useRoute();
const monitoringStore = useMonitoringStore();
const { t } = useI18n();
const projectId = String(route.params.id);

const project = computed(() =>
    monitoringStore.projects.find(p => String(p.id) === projectId)
);

const projectDevices = computed(() =>
    monitoringStore.iotDevices.filter(d => d && String(d.projectId) === projectId)
);

function toggleDevice(device) {
  device.status = device.status === "active" ? "inactive" : "active";
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
  background: linear-gradient(to bottom right, #f4f6f9, #e9ecf1);
  min-height: 100vh;
}

.devices-card {
  width: 100%;
  max-width: 1100px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title {
  margin: 0;
  font-weight: 700;
  color: #1f2933;
}

.subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Grid */
.device-grid {
  margin-top: 1rem;
}

/* Device Card */
.device-card {
  background: #f9fafb;
  border-radius: 14px;
  padding: 1.2rem;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
}

.device-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.device-title {
  margin: 0;
  font-weight: 600;
  color: #111827;
}

/* Status badge */
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #b91c1c;
}

/* Body */
.device-body {
  font-size: 0.9rem;
  color: #374151;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
