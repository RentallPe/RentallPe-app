<template>
  <div class="billing-wrapper">
    <pv-card class="profile-card">
      <template #title>
        <div class="billing-header">
          <div class="title-block">
            <i class="pi pi-credit-card header-icon"></i>
            <h2 class="page-title">{{ t('billing.title') }}</h2>
          </div>
          <span class="payment-count">
            {{ pendingPayments.length }} {{ t('billing.pending') }}
          </span>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <div
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="col-12 md:col-6 lg:col-4"
          >
            <pv-card class="billing-card">
              <template #title>
                <div class="billing-card-header">
                  <h3 class="billing-title">{{ payment.propertyName }}</h3>
                  <span
                      class="status-chip"
                      :class="payment.status"
                  >
                    {{ t('billing.status.' + payment.status) }}
                  </span>
                </div>
              </template>

              <template #content>
                <div class="billing-info">
                  <p><strong>{{ t('billing.address') }}:</strong> {{ payment.address }}</p>
                  <p><strong>{{ t('billing.customer') }}:</strong> {{ payment.customerName }}</p>
                  <p class="amount">
                    <strong>{{ t('billing.amount') }}:</strong>
                    S/. {{ payment.amount }}
                  </p>
                  <p>
                    <strong>{{ t('billing.dueDate') }}:</strong>
                    {{ payment.maturityDate }}
                  </p>
                </div>

                <div class="flex justify-content-end mt-3">
                  <pv-button
                      :label="t('billing.payNow')"
                      icon="pi pi-credit-card"
                      severity="success"
                      class="pay-btn"
                      @click="payCombo(payment)"
                  />
                </div>
              </template>
            </pv-card>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Diálogo de confirmación -->
    <pv-dialog
        v-model:visible="paymentDialogVisible"
        :header="t('billing.confirmPayment')"
        modal
        class="payment-dialog"
        :style="{ width: '420px' }"
    >
      <div v-if="selectedPayment" class="payment-summary">
        <div class="card-preview">
          <i class="pi pi-credit-card"></i>
          <div>
            <p class="card-type">{{ selectedPayment.cardType }}</p>
            <p class="card-number">
              **** **** **** {{ String(selectedPayment.cardNumber).slice(-4) }}
            </p>
          </div>
        </div>

        <div class="amount-preview">
          <span>{{ t('billing.totalToPay') }}</span>
          <strong>S/. {{ selectedPayment.amount }}</strong>
        </div>
      </div>

      <template #footer>
        <pv-button
            :label="t('billing.cancel')"
            severity="secondary"
            @click="paymentDialogVisible=false"
        />
        <pv-button
            :label="t('billing.confirm')"
            severity="success"
            icon="pi pi-check"
            @click="confirmPayment"
        />
      </template>
    </pv-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePaymentStore } from "@/Rental/application/payment-store.js";
import { useUserStore } from "@/IAM/application/user.store.js";

const { t } = useI18n();
const store = usePaymentStore();

const paymentDialogVisible = ref(false);
const selectedPayment = ref(null);
const userStore = useUserStore();
const currentUser = computed(() => userStore.user);
const pendingPayments = computed(() => {
  if (!currentUser.value) return [];
  return store.payments
      .filter(p => {
        const isPending = (p.status || "").toLowerCase() === "pending";
        const isMine =
            String(p.customerId) === String(currentUser.value.id) ||
            String(p.userId) === String(currentUser.value.id);
        return isPending && isMine;
      })
      .map(p => ({
        id: p.id,
        propertyName: p.propertyName || `Property ${p.propertyId}`,
        address: p.address || "—",
        customerName: p.customerName || "—",
        amount: p.amount,
        maturityDate: formatDate(p.date),
        status: p.status || "pending",
        cardType: p.cardType || "Visa",
        cardNumber: p.cardNumber || "0000 0000 0000 0000"
      }));
});



onMounted(async () => {
  await userStore.fetchUsers(); // o fetchUserById
  await store.fetchPayments();
});


function formatDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}




async function payCombo(payment) {
  // Traer el detalle desde el backend
  const paymentDetail = await store.getPaymentById(payment.id);
  console.log("Detalle del pago:", paymentDetail);

  // Guardar el pago seleccionado para mostrar en el diálogo
  selectedPayment.value = paymentDetail;
  paymentDialogVisible.value = true;

}

async function confirmPayment() {
  console.log("ID a pagar:", selectedPayment.value.id);
  try {
    await store.markAsPaid(selectedPayment.value.id);
    alert("Pago realizado con éxito");
    paymentDialogVisible.value = false;

  } catch (err) {
    console.error("Error al pagar combo:", err);
    alert("No se pudo procesar el pago");
  }
}
</script>

<style scoped>
.billing-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, #f9fafb, #f3f4f6);
  min-height: 100vh;
}

/* MAIN CARD */
.profile-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

/* HEADER */
.billing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-block {
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
  margin: 0;
  color: #000;
  font-weight: 800;
}

.payment-count {
  background: #b22222;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
}

/* BILLING CARD */
.billing-card {
  border-radius: 16px;
  transition: all 0.25s ease;
  background: #fafafa;
  border: 1px solid #eee;
}

.billing-card:hover {
  transform: translateY(-3px);
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.billing-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.billing-title {
  margin: 0;
  font-weight: 700;
  color: #000;
}

/* INFO */
.billing-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #222;
}

.amount {
  font-size: 1.05rem;
  color: #000;
}

/* STATUS */
.status-chip {
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-chip.pending {
  background: #fff3cd;
  color: #856404;
}

.status-chip.paid {
  background: #d4edda;
  color: #155724;
}

/* BUTTON */
.pay-btn {
  border-radius: 999px;
  font-weight: 700;
}

/* PAYMENT DIALOG */
.payment-dialog :deep(.p-dialog-content) {
  padding-top: 1rem;
}

.payment-summary {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.card-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #1f2933, #374151);
  color: #fff;
  padding: 1rem;
  border-radius: 14px;
}

.card-preview i {
  font-size: 2rem;
}

.card-type {
  font-weight: 700;
  margin: 0;
}

.card-number {
  font-size: 0.85rem;
  opacity: 0.85;
}

.amount-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
}

</style>