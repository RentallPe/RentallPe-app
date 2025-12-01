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
                               @click="openUpgradeDialog(plan)" />
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
                               @click="openUpgradeDialog(plan)" />
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

    <!-- Diálogo de confirmación de upgrade -->
    <pv-dialog v-model:visible="upgradeDialogVisible" header="Confirmar Upgrade" modal :style="{ width: '420px' }">
      <div v-if="selectedPlan">
        <p><strong>Plan actual:</strong> {{ subscription?.plan || "Ninguno" }}</p>
        <p><strong>Nuevo plan:</strong> {{ selectedPlan.name }}</p>
        <p>Precio: S/ {{ selectedPlan.price }} / mes</p>

        <h4>Método de pago</h4>
        <ul class="card-list">
          <li v-for="card in currentUser.paymentMethods" :key="card.id"
              @click="selectedCard = card"
              :class="{ selected: selectedCard?.id === card.id }">
            💳 {{ card.type }} **** {{ String(card.number).slice(-4) }} (exp: {{ card.expiry }})
          </li>
        </ul>
      </div>

      <template #footer>
        <pv-button label="Cancelar" severity="secondary" @click="upgradeDialogVisible=false" />
        <pv-button label="Confirmar" severity="success" @click="confirmUpgrade" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSubscriptionStore } from "@/Subscription/application/subscription-store";
import { useUserStore } from "@/IAM/application/user.store.js";

const { t } = useI18n();
const store = useSubscriptionStore();
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
const userStore = useUserStore();



const subscription = computed(() => store.subscription);
const plans = computed(() => store.plans);

onMounted(() => {
  store.load(currentUser.id);
});


const upgradePlans = computed(() => {
  if (!store.subscription) return store.plans;
  const currentIndex = store.plans.findIndex(p => p.id === store.subscription.plan);
  return store.plans.slice(currentIndex);
});


const upgradeDialogVisible = ref(false);
const selectedPlan = ref(null);
const selectedCard = ref(null);

function openUpgradeDialog(plan) {
  selectedPlan.value = plan;
  upgradeDialogVisible.value = true;
}

async function confirmUpgrade() {
  if (!selectedCard.value) {
    alert("Selecciona una tarjeta de pago.");
    return;
  }
  try {
    await store.createOrUpdate(currentUser.id, selectedPlan.value.id, selectedCard.value);
    alert(`Suscripción actualizada a ${selectedPlan.value.name} con la tarjeta ${selectedCard.value.type}`);
    upgradeDialogVisible.value = false;
  } catch (err) {
    console.error("Error al actualizar suscripción:", err);
    alert("No se pudo actualizar la suscripción");
  }
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

/* Tarjetas */
.card-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.card-list li {
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid #ddd;
}
.card-list li:hover {
  background: #f1f5f9;
}
.card-list li.selected {
  background: #d4edda;
  border-color: #28a745;
}
</style>