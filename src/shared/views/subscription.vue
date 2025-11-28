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
                               @click="createSubscription(plan.id)" />
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
                               @click="createSubscription(plan.id)" />
                    <span v-else class="status active">Plan actual</span>
                  </div>
                </template>
              </pv-card>
            </div>

            <div class="cancel-section">
              <pv-button label="Cancel Subscription" severity="danger" icon="pi pi-times" @click="cancelSubscription" />
            </div>
          </template>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const subscription = ref(null);
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// Definición de planes
const plans = [
  { id: "basic", name: "Basic", description: "Acceso a combos básicos.", price: 50, icon: "pi pi-check" },
  { id: "premium", name: "Premium", description: "Acceso a todos los combos, incluyendo Premium.", price: 100, icon: "pi pi-star" },
  { id: "enterprise", name: "Enterprise", description: "Soporte dedicado, reportes avanzados y beneficios exclusivos.", price: 200, icon: "pi pi-briefcase" }
];

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/subscription");
  subscription.value = res.data.find(s => s.customerId === currentUser.id);
});

// Filtrar planes superiores al actual
const upgradePlans = computed(() => {
  if (!subscription.value) return plans;
  const currentIndex = plans.findIndex(p => p.id === subscription.value.plan);
  return plans.slice(currentIndex); // muestra el actual y los superiores
});

async function createSubscription(planId) {
  const plan = plans.find(p => p.id === planId);
  const newSub = {
    id: Date.now().toString(),
    customerId: currentUser.id,
    plan: plan.id,
    price: plan.price,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active"
  };
  await axios.post("http://localhost:3000/subscription", newSub);
  subscription.value = newSub;
}

async function cancelSubscription() {
  if (!subscription.value) return;
  await axios.patch(`http://localhost:3000/subscription/${subscription.value.id}`, {
    status: "canceled"
  });
  subscription.value.status = "canceled";
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
  background: #f9fafb;   /* fondo claro */
  color: #111111;        /* texto oscuro */
}

.plan-card.premium h3 {
  color: #1a1a1a;        /* gris muy oscuro */
}

/* Estilo específico para Enterprise */
.plan-card.enterprise {
  background: #111111;   /* fondo negro */
  color: #ffffff;        /* texto blanco */
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