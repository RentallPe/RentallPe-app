<template>
  <div class="billing-wrapper">
    <pv-card class="profile-card">
      <template #title>
        <h2 class="page-title">{{ t('billing.title') }}</h2>
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
                <h3 class="m-0 text-black">{{ payment.propertyName }}</h3>
              </template>

              <template #content>
                <p class="text-black">
                  <strong>{{ t('billing.address') }}:</strong> {{ payment.address }}
                </p>
                <p class="text-black">
                  <strong>{{ t('billing.customer') }}:</strong> {{ payment.customerName }}
                </p>
                <p class="text-black">
                  <strong>{{ t('billing.amount') }}:</strong> S/. {{ payment.amount }}
                </p>
                <p class="text-black">
                  <strong>{{ t('billing.dueDate') }}:</strong> {{ payment.maturityDate }}
                </p>
                <p class="text-black">
                  <strong>{{ t('billing.status') }}:</strong> {{ payment.status }}
                </p>

                <!-- Botón de pago -->
                <div class="flex justify-content-end mt-3">
                  <pv-button
                      label="Pagar ahora"
                      icon="pi pi-credit-card"
                      severity="success"
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
    <pv-dialog v-model:visible="paymentDialogVisible" header="Confirmar Pago" modal :style="{ width: '420px' }">
      <div v-if="selectedPayment">
        <p>Vas a pagar con la tarjeta:</p>
        <p><strong>{{ selectedPayment.cardType }}</strong> **** {{ String(selectedPayment.cardNumber).slice(-4) }}</p>
        <p>Monto: S/. {{ selectedPayment.amount }}</p>
      </div>
      <template #footer>
        <pv-button label="Cancelar" severity="secondary" @click="paymentDialogVisible=false" />
        <pv-button label="Confirmar" severity="success" @click="confirmPayment" />
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
        const isPending = (p.status || "").toLowerCase() !== "paid";
        const isMine =
            String(p.customerId) === String(currentUser.value.id) ||
            String(p.userId) === String(currentUser.value.id); // 👈 acepta ambos
        console.log("Comparando:", p.customerId, p.userId, currentUser.value.id, "=>", isMine);
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
  background-color: #f9fafb;
  min-height: 100vh;
}
.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #000;
}
.billing-card {
  border-radius: 12px;
  margin-bottom: 1.5rem;
}
.text-black {
  color: #000;
}
.profile-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}
.p-component {
  background-color: #fff;
}
</style>