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

const projectId = String(route.params.id);

const project = computed(() =>
    monitoringStore.projects.find(p => String(p.id) === projectId)
);

const projectDevices = computed(() =>
    monitoringStore.iotDevices.filter(d => String(d.projectId) === projectId)
);

const projectNotifications = computed(() =>
    monitoringStore.notifications.filter(n => String(n.projectId) === projectId)
);

const projectReadings = computed(() =>
    monitoringStore.readings.filter(r => String(r.projectId) === projectId)
);

const projectWorkitems = computed(() =>
    monitoringStore.workitems.filter(w => String(w.projectId) === projectId)
);

</script>

<style scoped>
.project-detail-wrapper {
  padding: 2rem;
  padding-left: 260px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, #f9fafb, #f1f1f1);
  min-height: 100vh;
}

.project-detail-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  padding: 1.2rem;
}

/* TITULO PRINCIPAL */
.project-detail-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.4rem;
}

.project-detail-card p {
  color: #444;
  margin: 0.2rem 0;
  font-size: 0.95rem;
}

.project-detail-card strong {
  color: #a14949;
}

/* SECCIONES */
.project-detail-card h4 {
  margin-top: 1.4rem;
  margin-bottom: 0.5rem;
  color: #b22222;
  font-weight: 700;
  border-bottom: 2px solid #f76c6c;
  padding-bottom: 0.2rem;
}

/* LISTAS */
.project-detail-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-detail-card li {
  background: linear-gradient(135deg, #ffffff, #f3f3f3);
  border-left: 5px solid #a14949;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.9rem;
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
}

/* BOTÓN DISPOSITIVOS */
.project-detail-card .p-button {
  margin-top: 1rem;
  background: #a14949 !important;
  border: none !important;
}

.project-detail-card .p-button:hover {
  background: #f76c6c !important;
}

/* TEXTO NEGRO */
.text-black {
  color: #111;
}
</style>