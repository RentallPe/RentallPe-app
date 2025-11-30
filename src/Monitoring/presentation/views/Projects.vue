<template>
  <div class="projects-wrapper">
    <pv-card class="projects-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-briefcase text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Mis Proyectos</h2>
        </div>
      </template>

      <template #content>
        <div v-if="myProjects.length === 0">
          <p class="denyy">No tienes proyectos creados aún.</p>
        </div>

        <div v-else class="grid">
          <div v-for="p in myProjects" :key="p.id" class="col-12 md:col-6">
            <div class="project-card">
              <h3 class="project-title">{{ p.name }}</h3>
              <p>{{ p.description }}</p>
              <p><strong>Status:</strong> {{ p.status }}</p>
              <p><strong>Inicio:</strong> {{ new Date(p.startDate).toLocaleDateString("es-PE") }}</p>

              <router-link :to="`/projects/${p.id}`">
                <pv-button label="Ver detalle" icon="pi pi-search" severity="info" />
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";

const monitoringStore = useMonitoringStore();
const userStore = useUserStore();

onMounted(async () => {
  await Promise.all([
    monitoringStore.fetchProjects(),
    monitoringStore.fetchDevices(),
    monitoringStore.fetchWorkitems()
  ]);
});

const myProjects = computed(() =>
    monitoringStore.projects.filter(p => String(p.userId) === String(userStore.user?.id))
);


</script>

<style scoped>
.projects-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.projects-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}

.project-card {
  border: 1px solid #eee;
  border-radius: 12px;
  background: #eeeeee;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: scale(1.02);
  border-color: #b22222;
}

.project-title {
  font-weight: 600;
  color: #111111;
}
.text-black {
  color: #000;
}
.denyy{
  color: #111111;
}
</style>