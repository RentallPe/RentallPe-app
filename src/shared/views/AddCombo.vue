<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRentalStore } from "@/Rental/application/rental-store.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useRentalStore();
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const form = ref({
  name: "",
  description: "",
  price: 0,
  installDays: 1,
  image: "",
  providerId: currentUser.providerId
});

async function saveCombo() {
  if (!form.value.name || !form.value.description) {
    alert(t("addCombo.alerts.fillFields"));
    return;
  }

  await store.create("combos", form.value);
  alert(t("addCombo.alerts.created"));
  router.push("/my-combos");
}

function selectImage() {
  alert(t("addCombo.alerts.uploadNotImplemented"));
}
</script>

<template>
  <div class="add-combo-wrapper">
    <pv-card class="add-combo-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-box text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t("addCombo.title") }}</h2>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Imagen -->
          <div class="col-12 md:col-4 flex flex-column align-items-center">
            <div class="image-placeholder" @click="selectImage">
              <i class="pi pi-plus text-3xl text-black"></i>
            </div>
            <pv-button :label="t('addCombo.uploadImage')" icon="pi pi-image" class="mt-3" severity="info" />
          </div>

          <!-- Formulario -->
          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">{{ t("addCombo.infoTitle") }}</h3>

            <div class="info-grid">
              <div class="info-item">
                <label class="info-label" for="name">{{ t("addCombo.name") }}</label>
                <pv-input-text id="name" v-model="form.name" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="description">{{ t("addCombo.description") }}</label>
                <pv-textarea id="description" v-model="form.description" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="price">{{ t("addCombo.price") }}</label>
                <pv-input-number id="price" v-model="form.price" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="installDays">{{ t("addCombo.installDays") }}</label>
                <pv-input-number id="installDays" v-model="form.installDays" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="image">{{ t("addCombo.imageUrl") }}</label>
                <pv-input-text id="image" v-model="form.image" class="info-input" />
              </div>
            </div>

            <!-- Botón hecho -->
            <div class="flex justify-content-end mt-4">
              <pv-button :label="t('addCombo.save')" severity="success" icon="pi pi-check" @click="saveCombo" />
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.add-combo-wrapper {
  padding: 2rem;
  padding-left: 260px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.add-combo-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
  margin-inline: 1rem;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background: #fff;
  border: 2px dashed #b22222;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.text-black {
  color: #000;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
}

.info-input {
  font-size: 1rem;
  padding: 0.6rem;
}

@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
  .add-combo-card {
    margin-inline: 0.5rem;
    border-radius: 12px;
  }
}
</style>