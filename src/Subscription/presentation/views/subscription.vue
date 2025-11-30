<template>
  <div class="subscription-wrapper">
    <pv-card class="subscription-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-star text-2xl text-primary"></i>
          <h2 class="m-0 text-black">{{ t("subscription.title") }}</h2>
        </div>
      </template>

      <!-- Contenido -->
      <template #content>
        <div class="grid">
          <!-- Mostrar todos si no hay suscripción -->
          <template v-if="!subscription">
            <div v-for="plan in plans" :key="plan.id" class="col-12 md:col-4">
              <pv-card class="plan-card" :class="plan.id">
                <template #title>
                  <h3>{{ plan.name }}</h3>
                </template>
                <template #content>
                  <p>{{ plan.description }}</p>
                  <p>Precio: S/ {{ plan.price }} / mes</p>
                  <div class="subscription-actions">
                    <pv-button :label="`Subscribe ${plan.name}`"
                               :icon="plan.icon"
                               @click="createOrUpdateSubscription(plan.id)" />
                  </div>
                </template>
              </pv-card>
            </div>
          </template>

          <!-- Mostrar solo el actual y superiores si ya hay suscripción -->
          <template v-else>
            <div v-for="plan in upgradePlans" :key="plan.id" class="col-12 md:col-4">
              <pv-card class="plan-card" :class="[plan.id, { active: subscription.plan === plan.id }]">
                <template #title>
                  <h3>{{ plan.name }}</h3>
                </template>
                <template #content>
                  <p>{{ plan.description }}</p>
                  <p>Precio: S/ {{ plan.price }} / mes</p>
                  <div class="subscription-actions">
                    <pv-button v-if="subscription.plan !== plan.id"
                               :label="`Upgrade to ${plan.name}`"
                               :icon="plan.icon"
                               severity="success"
                               @click="createOrUpdateSubscription(plan.id)" />
                    <span v-else class="status active">Plan actual</span>
                  </div>
                </template>
              </pv-card>
            </div>

            <div class="cancel-section">
              <pv-button label="Cancel SubscriptionEntity" severity="danger" icon="pi pi-times" @click="cancelSubscription" />
            </div>
          </template>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store";

const { t } = useI18n();
const store = useSubscriptionStore();
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// reactividad directa desde el store
const subscription = computed(() => store.subscription);
const plans = computed(() => store.plans);

onMounted(() => {
  store.load(currentUser.id);
});

// planes superiores al actual
const upgradePlans = computed(() => {
  if (!store.subscription) return store.plans;
  const currentIndex = store.plans.findIndex(p => p.id === store.subscription.plan);
  return store.plans.slice(currentIndex);
});

function createOrUpdateSubscription(planId) {
  store.createOrUpdate(currentUser.id, planId);
}

function cancelSubscription() {
  store.cancel(currentUser.id)
      .then(() => {

        window.location.reload();
      })
      .catch(err => {
        console.error("Error al cancelar la suscripción:", err);
      });
}

</script>



<style scoped>
.subscription-wrapper {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.subscription-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
}

.plan-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.2s, border-color 0.2s;
}

.plan-card:hover {
  transform: scale(1.02);
  border-color: #b22222;
}

.plan-card.active {
  border: 2px solid #28a745;
  background: #f0fff4;
}

.subscription-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.cancel-section {
  margin-top: 2rem;
  text-align: center;
}

.status.active {
  background: #d4edda;
  color: #155724;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

.plan-card h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Estilo específico para Premium */
.plan-card.premium {
  background: #f9fafb;
  color: #111111;
}

.plan-card.premium h3 {
  color: #1a1a1a;
}

/* Estilo específico para Enterprise */
.plan-card.enterprise {
  background: #111111;
  color: #ffffff;
}

.plan-card.enterprise h3,
.plan-card.enterprise p {
  color: #ffffff;
}

.plan-card.enterprise:hover {
  transform: scale(1.02);
  border-color: #b22222;
}
</style>
