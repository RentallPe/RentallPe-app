<template>
  <div class="project-detail-wrapper">
    <pv-card class="project-detail-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-home text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Detalle del Proyecto</h2>
        </div>
      </template>

      <template #content>
        <div v-if="!project">
          <p>Proyecto no encontrado.</p>
        </div>

        <div v-else>
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <p><strong>Status:</strong> {{ project.status }}</p>
          <p><strong>Inicio:</strong> {{ new Date(project.startDate).toLocaleString("es-PE") }}</p>

          <h4>Dispositivos IoT</h4>
          <ul>
            <li v-for="d in projectDevices" :key="d.id">
              {{ d.type }} - {{ d.status }}
            </li>
          </ul>

          <h4>Notificaciones</h4>
          <ul>
            <li v-for="n in projectNotifications" :key="n.id">
              {{ n.message }} ({{ new Date(n.createdAt).toLocaleString("es-PE") }})
            </li>
          </ul>

          <h4>Lecturas recientes</h4>
          <ul>
            <li v-for="r in projectReadings" :key="r.id">
              {{ r.metricName }}: {{ r.value }} {{ r.unit }} ({{ new Date(r.timestamp).toLocaleString("es-PE") }})
            </li>
          </ul>

          <h4>Workitems</h4>
          <ul>
            <li v-for="w in projectWorkitems" :key="w.id">
              {{ w.description }} - {{ w.status }}
            </li>
          </ul>

          <router-link :to="`/projects/${project.id}/devices`">
            <pv-button label="Ver dispositivos" icon="pi pi-cog" severity="success" />
          </router-link>
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

const project = computed(() =>
    monitoringStore.projects.find(p => p.id === projectId)
);

const projectDevices = computed(() =>
    monitoringStore.iotDevices.filter(d => d.projectId === projectId)
);

const projectNotifications = computed(() =>
    monitoringStore.notifications.filter(n => n.projectId === projectId)
);

const projectReadings = computed(() =>
    monitoringStore.readings.filter(r => r.projectId === projectId)
);

const projectWorkitems = computed(() =>
    monitoringStore.workitems.filter(w => w.projectId === projectId)
);
</script>

<style scoped>
.project-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.project-detail-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
}

.text-black {
  color: #000;
}
</style>