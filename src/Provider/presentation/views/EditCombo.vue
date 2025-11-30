<script setup>
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useProviderStore();


const form = ref(null);

onMounted(async () => {
  const combo = await store.fetchById("combos", route.params.id);
  form.value = {...combo};
});

async function updateCombo() {
  if (!form.value.name || !form.value.description) {
    alert(t("editCombo.alerts.fillFields"));
    return;
  }

  form.value.id = Number(form.value.id);

  await store.update("combos", form.value);
  alert(t("editCombo.alerts.updated"));
  router.push("/my-combos");
}
</script>

<template>
  <div class="form-wrapper" v-if="form">
    <pv-card class="form-card">
      <template #title>
        <h2>{{ t("editCombo.title") }}</h2>
      </template>

      <template #content>
        <div class="form-grid">
          <pv-input-text v-model="form.name" :placeholder="t('editCombo.name')" class="w-full mb-3"/>
          <pv-textarea v-model="form.description" :placeholder="t('editCombo.description')" class="w-full mb-3"/>
          <pv-input-number v-model="form.price" :placeholder="t('editCombo.price')" class="w-full mb-3"/>
          <pv-input-number v-model="form.installDays" :placeholder="t('editCombo.installDays')" class="w-full mb-3"/>
          <pv-input-text v-model="form.image" :placeholder="t('editCombo.imageUrl')" class="w-full mb-3"/>
        </div>
        <div class="actions">
          <pv-button :label="t('editCombo.update')" icon="pi pi-check" severity="success" @click="updateCombo"/>
          <router-link to="/my-combos">
            <pv-button :label="t('editCombo.cancel')" icon="pi pi-times" severity="secondary"/>
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.form-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: #f9fafb;
  min-height: 100vh;
}

.form-card {
  width: 100%;
  max-width: 600px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>