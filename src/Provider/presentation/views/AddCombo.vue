<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useProviderStore();

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const fileInput = ref(null);

const form = ref({
  id: String(Date.now()),
  providerId: currentUser.providerId,
  name: "",
  description: "",
  price: 0,
  installDays: 1,
  image: "https://picsum.photos/400/250?random=99",
  planType: "basic",
  devices: []
});

const deviceInput = ref("");

async function saveCombo() {
  if (!form.value.name || !form.value.description || !form.value.price) {
    alert(t("addCombo.alerts.fillFields"));
    return;
  }

  // Normalización final
  const payload = {
    ...form.value,
    price: Number(form.value.price),
    installDays: Number(form.value.installDays),
    devices: Array.isArray(form.value.devices)
        ? form.value.devices
        : []
  };

  await store.createCombo(payload, currentUser);


  alert(t("addCombo.alerts.created"));
  router.push("/my-combos");
}

function addDevice() {
  if (!deviceInput.value) return;
  form.value.devices.push(deviceInput.value);
  deviceInput.value = "";
}

function removeDevice(index) {
  form.value.devices.splice(index, 1);
}

function onImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    form.value.image = reader.result;
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="add-combo-wrapper">
    <pv-card class="add-combo-card">

      <!-- HEADER -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-box text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t("addCombo.title") }}</h2>
        </div>
      </template>

      <template #content>
        <div class="grid">

          <!-- IMAGEN -->
          <div class="col-12 md:col-4 flex flex-column align-items-center">
            <div class="image-placeholder" @click="fileInput.click()">
              <img :src="form.image" class="combo-preview" />
            </div>

            <input type="file" hidden ref="fileInput" @change="onImageChange"/>

            <pv-button
                :label="t('addCombo.uploadImage')"
                icon="pi pi-image"
                class="mt-3"
                severity="info"
                @click="fileInput.click()"
            />
          </div>

          <!-- FORM -->
          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">{{ t("addCombo.infoTitle") }}</h3>

            <div class="info-grid">

              <div class="info-item">
                <label class="info-label">{{ t("addCombo.name") }}</label>
                <pv-input-text v-model="form.name" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t("addCombo.description") }}</label>
                <pv-textarea v-model="form.description" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t("addCombo.price") }}</label>
                <pv-input-number v-model="form.price" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t("addCombo.installDays") }}</label>
                <pv-input-number v-model="form.installDays" class="info-input"/>
              </div>

              <!-- PLAN TYPE -->
              <div class="info-item">
                <label class="info-label">{{ t("addCombo.planType") }}</label>
                <pv-dropdown
                    v-model="form.planType"
                    :options="[
                      { label: t('addCombo.planOptions.basic'), value: 'basic' },
                      { label: t('addCombo.planOptions.premium'), value: 'premium' },
                      { label: t('addCombo.planOptions.enterprise'), value: 'enterprise' }
                    ]"
                    class="info-input"
                />
                <span :class="['plan-badge', form.planType]">{{ t('addCombo.planOptions.' + form.planType) }}</span>
              </div>

            </div>

            <!-- DEVICES -->
            <h3 class="text-black mt-4">{{ t("addCombo.devicesTitle") }}</h3>

            <div class="flex gap-2 mb-2">
              <pv-input-text
                  v-model="deviceInput"
                  :placeholder="t('addCombo.devicePlaceholder')"
                  class="info-input w-full"
              />
              <pv-button icon="pi pi-plus" @click="addDevice"/>
            </div>

            <div v-if="form.devices.length === 0" class="muted">{{ t("addCombo.noDevices") }}</div>

            <div v-for="(d,i) in form.devices" :key="i" class="device-item">
              {{ d }}
              <pv-button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="removeDevice(i)"
              />
            </div>

            <!-- ACTION -->
            <div class="flex justify-content-end mt-4">
              <pv-button
                  :label="t('addCombo.save')"
                  severity="success"
                  icon="pi pi-check"
                  @click="saveCombo"
              />
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
  background-color: #f3f4f6; /* gris suave */
  min-height: 100vh;
}

.add-combo-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 18px;
  margin-inline: 1rem;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  padding: 1.5rem;
}

.image-placeholder {
  width: 100%;
  height: 220px;
  border: 2px dashed #d1d5db; /* gris */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background: #f9fafb;
}

.combo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #374151; /* gris oscuro */
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.info-input {
  font-size: 1rem;
  padding: 0.6rem;
  border-radius: 10px;
  background: #f3f4f6; /* gris claro */
  color: #111; /* texto negro */
  border: 1px solid #d1d5db;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4rem 0;
  border-bottom: 1px solid #e5e7eb;
  color: #111;
}

/* Badges */
.badge {
  width: fit-content;
  margin-top: 0.3rem;
  font-size: .75rem;
  padding: .2rem .7rem;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}

.badge.basic {
  background: #e5e7eb; /* gris */
  color: #111;
}

.badge.premium {
  background: linear-gradient(135deg, gold, orange);
  color: #000;
}

.badge.enterprise {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
}

.pv-button {
  border-radius: 10px;
  font-weight: 600;
}

/* Inputs especiales */
:deep(.p-inputnumber .p-inputtext) {
  background: #f3f4f6;
  color: #111;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem;
}

:deep(.p-dropdown) {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  height: 2rem;
  min-width: 120px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #111;
  border: 1px solid #d1d5db;
}

:deep(.p-dropdown .p-dropdown-label) {
  font-size: 0.85rem;
  line-height: 1.2rem;
  padding: 0.2rem 0.4rem;
  color: #111 !important;
}

:deep(.p-dropdown-panel .p-dropdown-item) {
  background: #fff;
  color: #111;
}

:deep(.p-dropdown-panel .p-dropdown-item.p-highlight) {
  background: #b22222;
  color: #fff;
}

/* Plan badges */
.plan-badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.8rem;
}

.plan-badge.basic {
  background: #e5e7eb;
  color: #111;
}

.plan-badge.premium {
  background: linear-gradient(135deg, gold, orange);
  color: #000;
}

.plan-badge.enterprise {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
}
/* Forzar texto negro en todo el formulario */
.add-combo-card,
.add-combo-card h1,
.add-combo-card h2,
.add-combo-card h3,
.add-combo-card h4,
.add-combo-card h5,
.add-combo-card h6,
.add-combo-card p,
.add-combo-card label,
.add-combo-card span,
.add-combo-card div {
  color: #111 !important;
}

/* Inputs y dropdowns con texto negro */
.info-input {
  background: #f3f4f6;   /* gris claro */
  color: #111 !important; /* texto negro */
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem;
}

/* InputNumber texto negro */
:deep(.p-inputnumber .p-inputtext) {
  background: #f3f4f6;
  color: #111 !important;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem;
}

/* Dropdown texto negro */
:deep(.p-dropdown) {
  background: #f3f4f6;
  color: #111 !important;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  height: 2rem;
  min-width: 120px;
}

:deep(.p-dropdown .p-dropdown-label) {
  color: #111 !important;
}
</style>