<template>
  <div class="subscription-wrapper">
    <pv-card class="subscription-card">
      <!-- TÍTULO -->
      <template #title>
        <div class="subscription-header">
          <div class="header-left">
            <i class="pi pi-star header-icon"></i>
            <h2 class="page-title">{{ t("subscription.title") }}</h2>
          </div>

          <span v-if="subscription" class="current-plan-chip">
            {{ t("subscription.currentPlan") }}: {{ subscription.plan.toUpperCase() }}
          </span>
        </div>
      </template>

      <!-- CONTENIDO -->
      <template #content>
        <div class="grid">
          <!-- SIN SUSCRIPCIÓN -->
          <template v-if="!subscription">
            <div
                v-for="plan in plans"
                :key="plan.id"
                class="col-12 md:col-4"
            >
              <pv-card class="plan-card" :class="plan.id">
                <template #title>
                  <h3 class="plan-title">{{ plan.name }}</h3>
                </template>

                <template #content>
                  <p class="plan-description">{{ plan.description }}</p>

                  <p class="plan-price">
                    S/ {{ plan.price }} <span>/ {{ t("subscription.month") }}</span>
                  </p>

                  <ul class="features">
                    <li v-for="f in plan.features" :key="f">
                      <i class="pi pi-check-circle"></i> {{ f }}
                    </li>
                  </ul>

                  <div class="subscription-actions">
                    <pv-button
                        :label="t('subscription.subscribeTo', { plan: plan.name })"
                        :icon="plan.icon"
                        class="subscribe-btn"
                        severity="success"
                        @click="openUpgradeDialog(plan)"
                    />
                  </div>
                </template>
              </pv-card>
            </div>
          </template>

          <!-- CON SUSCRIPCIÓN -->
          <template v-else>
            <div
                v-for="plan in upgradePlans"
                :key="plan.id"
                class="col-12 md:col-4"
            >
              <pv-card
                  class="plan-card"
                  :class="[plan.id, { active: subscription.plan === plan.id }]"
              >
                <template #title>
                  <div class="plan-header">
                    <h3 class="plan-title">{{ plan.name }}</h3>
                    <span
                        v-if="subscription.plan === plan.id"
                        class="badge-current"
                    >
                      {{ t("subscription.current") }}
                    </span>
                  </div>
                </template>

                <template #content>
                  <p class="plan-description">{{ plan.description }}</p>

                  <p class="plan-price">
                    S/ {{ plan.price }} <span>/ {{ t("subscription.month") }}</span>
                  </p>

                  <div class="subscription-actions">
                    <pv-button
                        v-if="subscription.plan !== plan.id"
                        :label="t('subscription.upgradeTo', { plan: plan.name })"
                        :icon="plan.icon"
                        severity="success"
                        class="subscribe-btn"
                        @click="openUpgradeDialog(plan)"
                    />

                    <span v-else class="status-active">
                      ✔ {{ t("subscription.activePlan") }}
                    </span>
                  </div>
                </template>
              </pv-card>
            </div>

            <!-- CANCELACIÓN -->
            <div class="cancel-section">
              <pv-button
                  :label="t('subscription.cancel')"
                  severity="danger"
                  icon="pi pi-times"
                  class="cancel-btn"
                  @click="cancelSubscription"
              />
            </div>
          </template>
        </div>
      </template>
    </pv-card>

    <!-- DIÁLOGO UPGRADE -->
    <pv-dialog
        v-model:visible="upgradeDialogVisible"
        :header="t('subscription.confirmUpgrade')"
        modal
        :style="{ width: '420px' }"
    >
      <div v-if="selectedPlan" class="upgrade-summary">
        <p>
          <strong>{{ t("subscription.currentPlan") }}:</strong>
          {{ subscription?.plan || t("subscription.none") }}
        </p>
        <p>
          <strong>{{ t("subscription.newPlan") }}:</strong>
          {{ selectedPlan.name }}
        </p>
        <p class="upgrade-price">
          S/ {{ selectedPlan.price }} / {{ t("subscription.month") }}
        </p>

        <h4>{{ t("subscription.paymentMethod") }}</h4>

        <ul class="card-list">
          <li
              v-for="card in currentUser.paymentMethods"
              :key="card.id"
              @click="selectedCard = card"
              :class="{ selected: selectedCard?.id === card.id }"
          >
            💳 {{ card.type }} **** {{ String(card.number).slice(-4) }}
            <span>(exp: {{ card.expiry }})</span>
          </li>
        </ul>
      </div>

      <template #footer>
        <pv-button
            :label="t('subscription.cancel')"
            severity="secondary"
            @click="upgradeDialogVisible=false"
        />
        <pv-button
            :label="t('subscription.confirm')"
            severity="success"
            icon="pi pi-check"
            @click="confirmUpgrade"
        />
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
    if (!store.subscription) {
      await store.subscribe(selectedPlan.value, currentUser.id);
    } else {
      await store.upgrade(selectedPlan.value);
    }
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
  min-height: 100vh;
  background: linear-gradient(180deg, #f9fafb, #f1f5f9);
  display: flex;
  justify-content: center;
}

/* MAIN CARD */
.subscription-card {
  width: 100%;
  max-width: 1100px;
  background: #fff;
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

/* HEADER */
.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-icon {
  font-size: 1.6rem;
  color: #b22222;
}

.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #000;
  margin: 0;
}

.current-plan-chip {
  background: #111827;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-weight: 700;
}

/* PLAN CARD BASE */
.plan-card {
  height: 100%;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 1.4rem;
  transition: all 0.25s ease;
  background: #fafafa;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

/* PLAN HEADER */
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-title {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
}

.plan-description {
  margin: 0.6rem 0;
  font-size: 0.9rem;
  color: #374151;
}

/* PRICE */
.plan-price {
  font-size: 1.6rem;
  font-weight: 900;
  color: #000;
  margin: 0.8rem 0;
}
.plan-price span {
  font-size: 0.9rem;
  color: #6b7280;
}

/* FEATURES */
.features {
  list-style: none;
  padding: 0;
  margin: 0.8rem 0 1rem;
  gap: 0.4rem;
  display: flex;
  flex-direction: column;
}

.features li {
  font-size: 0.9rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.features i {
  color: #22c55e;
}

/* ACTIONS */
.subscription-actions {
  margin-top: 1.2rem;
}

.subscribe-btn {
  width: 100%;
  border-radius: 999px;
  font-weight: 700;
}

/* ACTIVE PLAN */
.plan-card.active {
  border: 2px solid #22c55e;
  background: linear-gradient(180deg, #ecfdf5, #ffffff);
}

.badge-current {
  background: #22c55e;
  color: #fff;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
}

.status-active {
  display: inline-block;
  background: #dcfce7;
  color: #15803d;
  font-weight: 700;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

/* CANCEL */
.cancel-section {
  grid-column: 1 / -1;
  margin-top: 2rem;
  text-align: center;
}

.cancel-btn {
  border-radius: 999px;
  font-weight: 700;
}

/* BASIC */
.plan-card.basic {
  background: #ffffff;
}

/* PREMIUM */
.plan-card.premium {
  background: linear-gradient(180deg, #fefce8, #ffffff);
  border-color: #fde68a;
}

/* ENTERPRISE */
.plan-card.enterprise {
  background: linear-gradient(180deg, #111827, #1f2933);
  color: #ffffff;
  border-color: #1f2933;
}

.plan-card.enterprise .plan-title,
.plan-card.enterprise .plan-description,
.plan-card.enterprise .plan-price,
.plan-card.enterprise li {
  color: #ffffff;
}

/* UPGRADE DIALOG */
.upgrade-summary p {
  margin: 0.4rem 0;
}

.upgrade-price {
  font-size: 1.3rem;
  font-weight: 900;
  margin-top: 0.6rem;
}

/* CARD LIST */
.card-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-list li {
  padding: 0.6rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-list li:hover {
  background: #f1f5f9;
}

.card-list li.selected {
  background: #dcfce7;
  border-color: #22c55e;
}
.plan-card {
  color: #000 !important;
}

.plan-card .plan-title,
.plan-card .plan-description,
.plan-card .plan-price,
.plan-card li {
  color: #000 ;
}
/* ENTERPRISE */
.plan-card.enterprise {
  background: linear-gradient(180deg, #111827, #1f2933);
  color: #ffffff;
  border-color: #1f2933;
}

.plan-card.enterprise .plan-title,
.plan-card.enterprise .plan-description,
.plan-card.enterprise .plan-price,
.plan-card.enterprise li {
  color: #ffffff;
}

</style>