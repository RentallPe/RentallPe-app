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
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePaymentStore } from "@/Rental/application/payment-store.js";

const { t } = useI18n();
const store = usePaymentStore();

onMounted(() => store.fetchPayments());

function formatDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

const pendingPayments = computed(() =>
    store.payments
        .filter(p => (p.status || "").toLowerCase() !== "paid")
        .map(p => ({
          id: p.id,
          propertyName: p.propertyName || `Property ${p.propertyId}`,
          address: p.address || "—",
          customerName: p.customerName || "—",
          amount: p.amount,
          maturityDate: formatDate(p.date),
          status: p.status || "pending"
        }))
);

async function payCombo(payment) {
  try {
    await store.markAsPaid(payment.id);
    alert("Pago realizado con éxito");
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