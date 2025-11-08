<template>
  <div class="combo-detail-wrapper">
    <pv-card class="combo-detail-card">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2 class="m-0 text-black">{{ combo?.name }}</h2>

          <router-link to="/my-combos">
            <pv-button
                icon="pi pi-arrow-left"
                severity="secondary"
                class="square-btn"
            />
          </router-link>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Imagen -->
          <div class="col-12 md:col-4 flex justify-content-center">
            <img :src="combo?.image" alt="" class="combo-img" />
          </div>

          <!-- Descripción -->
          <div class="col-12 md:col-4">
            <h3>Description</h3>
            <p>{{ combo?.description }}</p>
            <p><strong>Installation time:</strong> {{ combo?.installDays }} days</p>
          </div>

          <!-- Acciones del proveedor -->
          <div class="col-12 md:col-4 flex flex-column justify-content-between">
            <div>
              <h3>Price</h3>
              <p class="price-text">$ {{ combo?.price }}</p>
            </div>

            <div class="mt-auto flex gap-2">
              <pv-button
                  label="Edit"
                  icon="pi pi-pencil"
                  severity="info"
                  class="w-full"
                  @click="editCombo"
              />
              <pv-button
                  label="Delete"
                  icon="pi pi-trash"
                  severity="danger"
                  class="w-full"
                  @click="deleteCombo"
              />
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRentalStore } from "@/Rental/application/rental-store.js";

const route = useRoute();
const router = useRouter();
const store = useRentalStore();

const combo = ref(null);

onMounted(async () => {
  combo.value = await store.fetchById("combos", route.params.id);
});

function editCombo() {
  router.push(`/edit-combo/${combo.value.id}`);
}

async function deleteCombo() {
  if (confirm("Are you sure you want to delete this combo?")) {
    await store.remove("combos", combo.value.id);
    alert("Combo deleted successfully");
    router.push("/my-combos");
  }
}
</script>

<style scoped>
.combo-detail-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}
.combo-detail-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  color: #252525;
}
.combo-img {
  width: 100%;
  border-radius: 8px;
}
.square-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  background: #f76c6c;
  justify-content: center;
}
.price-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #b22222;
}
</style>