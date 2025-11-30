<script setup>
import { onMounted, computed } from "vue";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

const providerStore = useProviderStore();
const userStore = useUserStore();
const monitoringStore = useMonitoringStore();

onMounted(async () => {
  await Promise.all([
    providerStore.fetchCombos(),
    monitoringStore.fetchProjects(),
    monitoringStore.fetchDevices(),
    monitoringStore.fetchNotifications(),
    monitoringStore.fetchReadings(),
    monitoringStore.fetchWorkitems()
  ]);
});

const myProjects = computed(() => {
  return monitoringStore.projects.filter(p => p.userId === userStore.user?.id);
});

function devicesForProject(projectId) {
  return monitoringStore.devices.filter(d => d.projectId === projectId);
}

function notificationsForProject(projectId) {
  return monitoringStore.notifications.filter(n => n.projectId === projectId);
}

function readingsForProject(projectId) {
  return monitoringStore.readings.filter(r => r.projectId === projectId);
}

function workitemsForProject(projectId) {
  return monitoringStore.workitems.filter(w => w.projectId === projectId);
}
</script>

<template>
  <div>
    <h2>Mis Combos / Proyectos</h2>
    <div v-for="p in myProjects" :key="p.id" class="project-card">
      <h3>{{ p.name }}</h3>
      <p>{{ p.description }}</p>

      <h4>Dispositivos IoT</h4>
      <ul>
        <li v-for="d in devicesForProject(p.id)" :key="d.id">
          {{ d.type }} - {{ d.status }}
        </li>
      </ul>

      <h4>Notificaciones</h4>
      <ul>
        <li v-for="n in notificationsForProject(p.id)" :key="n.id">
          {{ n.message }} ({{ new Date(n.createdAt).toLocaleString("es-PE") }})
        </li>
      </ul>

      <h4>Lecturas recientes</h4>
      <ul>
        <li v-for="r in readingsForProject(p.id)" :key="r.id">
          {{ r.metricName }}: {{ r.value }} {{ r.unit }} ({{ new Date(r.timestamp).toLocaleString("es-PE") }})
        </li>
      </ul>

      <h4>Workitems</h4>
      <ul>
        <li v-for="w in workitemsForProject(p.id)" :key="w.id">
          {{ w.description }} - {{ w.status }}
        </li>
      </ul>

      <router-link :to="`/projects/${p.id}`">Ver detalle</router-link>
    </div>
  </div>
</template>