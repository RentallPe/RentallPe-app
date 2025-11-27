<template>
  <div class="incident-wrapper">
    <pv-card class="incident-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle text-danger text-2xl"></i>
            <h2 class="m-0 text-black">Register incident</h2>
          </div>
          <!-- Botón de regresar -->
          <router-link to="/support">
            <pv-button
                label="Back"
                icon="pi pi-arrow-left"
                class="back-button"
            />
          </router-link>
        </div>
      </template>

      <template #content>
        <h3 class="text-black mb-3">Tell us your problem</h3>

        <pv-textarea
            v-model="incident.description"
            autoResize
            rows="6"
            placeholder="Describe the issue you're experiencing..."
            class="incident-textarea"
        />

        <div class="flex justify-content-end mt-4">
          <pv-button
              label="Send"
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
import { useRentalStore } from "@/Rental/application/rental-store";

const router = useRouter();
const rental = useRentalStore();

const incident = ref({ description: "" });

async function submitIncident() {
  if (!incident.value.description?.trim()) {
    alert("Please describe the incident before submitting.");
    return;
  }

  const newIncident = {
    id: Date.now(),
    projectId: 1,
    description: incident.value.description.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  try {
    await rental.create("incidents", newIncident);
    incident.value.description = "";
    router.push("/support");
  } catch (err) {
    console.error("Error saving incident:", err);
    alert("Could not save the incident. Please try again.");
  }
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