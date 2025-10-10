<template>
  <div class="incident-wrapper">
    <pv-card class="incident-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle text-danger text-2xl"></i>
            <h2 class="m-0 text-black">{{ t('incident.title') }}</h2>
          </div>
          <!-- Botón de regresar -->
          <router-link to="/support">
            <pv-button
                :label="t('incident.back')"
                icon="pi pi-arrow-left"
                class="back-button"
            />
          </router-link>
        </div>
      </template>

      <template #content>
        <h3 class="text-black mb-3">{{ t('incident.subtitle') }}</h3>

        <pv-textarea
            v-model="incident.description"
            autoResize
            rows="6"
            :placeholder="t('incident.placeholder')"
            class="incident-textarea"
        />

        <div class="flex justify-content-end mt-4">
          <pv-button
              :label="t('incident.send')"
              icon="pi pi-send"
              class="send-button"
              @click="submitIncident"
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const incident = ref({
  description: ""
});

async function submitIncident() {
  if (!incident.value.description.trim()) {
    alert(t('incident.alertEmpty'));
    return;
  }

  const res = await fetch("http://localhost:3000/user");
  const user = await res.json();

  const newIncident = {
    id: Date.now(),
    incNumber: "INC" + Math.floor(100000 + Math.random() * 900000),
    description: incident.value.description,
    date: new Date().toISOString(),
    status: t('incident.statusPending')
  };

  const updatedIncidents = [...(user.incidents || []), newIncident];

  await fetch("http://localhost:3000/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ incidents: updatedIncidents })
  });

  incident.value.description = "";
  router.push("/support");
}
</script>

<style scoped>
.incident-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.incident-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
}

.text-black {
  color: #000;
}

.back-button {
  background-color: #f76c6c;
  border: none;
  color: #fff;
}


.send-button {
  background-color: #f76c6c;
  border: none;
  color: #fff;
}

.incident-textarea {
  width: 100%;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid #f76c6c;
  background-color: #fff;
  color: #111;
}
</style>