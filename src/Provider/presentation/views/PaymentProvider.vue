<template>
  <div class="payment-wrapper">
    <pv-card class="payment-card">
      <!-- HEADER -->
      <template #title>
        <div class="header">
          <i class="pi pi-credit-card"></i>
          <h2>{{ t("payments.title") }}</h2>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>
        <div v-if="filteredPayments.length > 0" class="payments-container">
          <div
              v-for="pay in filteredPayments"
              :key="pay.id"
              class="payment-item"
          >
            <div class="payment-left">
              <p><strong>{{ t("payments.combo") }}:</strong> {{ pay.comboName }}</p>
              <p><strong>{{ t("payments.customer") }}:</strong> {{ pay.customerName }}</p>
              <p class="date">
                <i class="pi pi-calendar"></i>
                {{ formatDate(pay.date) }}
              </p>
            </div>

            <div class="payment-right">
              <p class="amount">S/ {{ pay.amount }}</p>
              <span class="status" :class="pay.status">
                {{ t("payments.status." + pay.status) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="no-payments">
          <i class="pi pi-inbox"></i>
          <p>{{ t("payments.noPayments") }}</p>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import axios from "axios";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const payments = ref([]);
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// Cargar pagos al montar
onMounted(async () => {
  try {
    const resPayments = await axios.get("http://localhost:3000/payments");
    payments.value = resPayments.data;
  } catch (err) {
    console.error("Error cargando payments:", err);
  }
});

// Filtrar según rol
const filteredPayments = computed(() => {
  if (!currentUser.role) return [];
  if (currentUser.role === "provider") {
    return payments.value.filter(p => p.providerId === currentUser.providerId);
  }
  if (currentUser.role === "customer") {
    return payments.value.filter(p => p.customerId === currentUser.id);
  }
  return [];
});

// Formatear fecha
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
</script>

<style scoped>
.payment-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f6f9, #e9eef3);
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.payment-card {
  width: 100%;
  max-width: 900px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #111;
}

.header i {
  font-size: 1.8rem;
  color: #6366f1;
}

.header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
}

/* PAYMENTS CONTAINER */
.payments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* EACH PAYMENT ITEM */
.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  transition: all 0.25s ease;
  border: 1px solid #e5e7eb;
}

.payment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
}

/* LEFT SIDE */
.payment-left p {
  margin: 0.2rem 0;
  color: #111;
  font-size: 0.95rem;
}

.payment-left strong {
  font-weight: 600;
}

.payment-left .date {
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* RIGHT SIDE */
.payment-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

/* AMOUNT */
.amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #10b981;
}

/* STATUS BADGES */
.status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  text-transform: capitalize;
}

/* STATUS COLORS */
.status.pending {
  background: #fff7ed;
  color: #9a3412;
}

.status.paid,
.status.completed {
  background: #ecfdf5;
  color: #065f46;
}

.status.failed {
  background: #fef2f2;
  color: #991b1b;
}

/* EMPTY STATE */
.no-payments {
  text-align: center;
  color: #6b7280;
  padding: 3rem 0;
}

.no-payments i {
  font-size: 3rem;
  margin-bottom: 0.8rem;
  display: block;
  color: #9ca3af;
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .payment-right {
    align-items: flex-start;
  }
}
</style>
