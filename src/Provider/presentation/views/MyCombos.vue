<script setup>
import { onMounted, computed } from "vue";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const rental = useProviderStore();

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const combos = computed(() => {
  const all = rental.list("combos").value ?? [];
  return all
      .filter(c => String(c.providerId) === String(currentUser.providerId))
      .map(c => ({
        ...c,
        image: c.image || `https://picsum.photos/800/600?random=${c.id ?? Math.random()}`,
        name: c.name ?? t("myCombos.unnamed"),
        description: c.description ?? t("myCombos.noDescription"),
        price: c.price ?? 0,
        installDays: c.installDays ?? "—"
      }));
});

onMounted(async () => {
  await rental.fetchAll("combos");
});
</script>

<template>
  <div class="combos-wrapper">
    <pv-card class="combo-card-container">
      <template #title>
        <h2 class="page-title">{{ t("myCombos.title") }}</h2>
      </template>

      <template #content>
        <div class="grid combo-grid grid-reset">
          <div
              v-for="combo in combos"
              :key="combo.id"
              class="col-12 md:col-6 lg:col-4 col-fix"
          >
            <pv-card class="combo-card">
              <template #header>
                <router-link :to="`/combo/${combo.id}`">
                  <img :src="combo.image" alt="Combo image" class="combo-img" />
                </router-link>
              </template>
              <template #content>
                <h3 class="combo-title">{{ combo.name }}</h3>
                <p class="combo-description">{{ combo.description }}</p>
                <p><strong>{{ t("myCombos.price") }}:</strong> ${{ combo.price }}</p>
                <p><strong>{{ t("myCombos.installTime") }}:</strong> {{ combo.installDays }} {{ t("myCombos.days") }}</p>
              </template>
            </pv-card>
          </div>
        </div>

        <div class="actions">
          <router-link to="/add-combo">
            <pv-button :label="t('myCombos.add')" icon="pi pi-plus" severity="primary" />
          </router-link>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.combos-wrapper {
  --sbw:260px;
  margin-left: var(--sbw);
  width: calc(100% - var(--sbw));
  padding: 2rem;
  background: #f9fafb;
  min-height: 100dvh;
  box-sizing: border-box;
  overflow-x: clip;
}

.combo-card-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #111;
}

.grid-reset {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.grid-reset > [class*="col-"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.col-fix {
  min-width: 0;
}

.combo-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.combo-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}
.combo-title {
  margin: 0.5rem 0 0;
  font-weight: 600;
  color: #111;
}
.combo-description {
  color: #6b7280;
  margin: 0.25rem 0 0.5rem;
}

.actions {
  display: flex;
  justify-content: end;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .combos-wrapper {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
  }
}
</style>