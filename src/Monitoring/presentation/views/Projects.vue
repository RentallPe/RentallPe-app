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
import { onMounted, computed, watch } from "vue";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";

const monitoringStore = useMonitoringStore();
const userStore = useUserStore();

onMounted(async () => {
  // Primero asegúrate que el usuario esté cargado
  if (!userStore.user) {
    await userStore.fetchCurrentUser(); // si tienes este método
  }

  await monitoringStore.fetchProjects();
  await monitoringStore.fetchDevices();
  await monitoringStore.fetchWorkitems();
});

const myProjects = computed(() => {
  const list = Array.isArray(monitoringStore.projects)
      ? monitoringStore.projects
      : [];

  if (!userStore.user?.id) return [];

  return list.filter(
      p => String(p.userId) === String(userStore.user.id)
  );
});


watch(
    () => userStore.user,
    (val) => {
      console.log("Usuario cargado:", val);
    },
    { immediate: true }
);

watch(
    () => monitoringStore.projects,
    (val) => {
      console.log("Proyectos cargados:", val);
    },
    { immediate: true }
);
</script>

<style scoped>
.projects-wrapper {
  padding: 2rem;
  padding-left: 260px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, #f9fafb, #f1f1f1);
  min-height: 100vh;
}

.projects-card {
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  padding: 0.5rem;
}

/* GRID */
.grid {
  margin-top: 1rem;
}

/* TARJETA DE PROYECTO */
.project-card {
  background: linear-gradient(135deg, #ffffff, #f3f3f3);
  border: 1px solid #e5e5e5;
  border-left: 6px solid #b22222;
  border-radius: 14px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.25s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.12);
  border-left-color: #f76c6c;
}

/* TITULO */
.project-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #111111;
  margin-bottom: 0.3rem;
}

/* TEXTO */
.project-card p {
  margin: 0.3rem 0;
  color: #444444;
  font-size: 0.95rem;
}

/* STATUS DESTACADO */
.project-card strong {
  color: #a14949;
}

/* BOTÓN */
.project-card .p-button {
  margin-top: 0.6rem;
  background: #a14949 !important;
  border: none !important;
}

.project-card .p-button:hover {
  background: #f76c6c !important;
}

/* TEXTO GENERAL */
.text-black {
  color: #111111;
}

/* MENSAJE SIN PROYECTOS */
.denyy {
  color: #666666;
  font-size: 1rem;
  text-align: center;
  padding: 1.5rem;
}
</style>