<template>
  <div class="payment-wrapper">
    <pv-card class="payment-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-credit-card text-2xl"></i>
          <h2 class="m-0 text-black">{{ t("payments.title") }}</h2>
        </div>
      </template>

      <template #content>
        <div v-if="filteredPayments.length > 0">
          <ul class="payment-list">
            <li v-for="pay in filteredPayments" :key="pay.id" class="payment-item">
              <div class="flex justify-content-between align-items-center">
                <div>
                  <p class="text-black"><strong>{{ t("payments.combo") }}:</strong> {{ pay.comboName }}</p>
                  <p><strong>{{ t("payments.customer") }}:</strong> {{ pay.customerName }}</p>
                  <p><strong>{{ t("payments.date") }}:</strong> {{ formatDate(pay.date) }}</p>
                </div>
                <div>
                  <p class="amount">S/ {{ pay.amount }}</p>
                  <span class="status" :class="pay.status">{{ t("payments.status." + pay.status) }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>{{ t("payments.noPayments") }}</p>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProviderStore } from "@/Provider/application/provider-store.js";

import axios from "axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const rental = useProviderStore();

const payments = ref([]);

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
const filteredPayments = ref([]);

onMounted(async () => {
  try {
    const resPayments = await axios.get("http://localhost:3000/payments");
    payments.value = resPayments.data;

    if (currentUser.role === "provider") {
      filteredPayments.value = payments.value.filter(
          payment => payment.providerId === currentUser.providerId
      );
    } else if (currentUser.role === "customer") {
      filteredPayments.value = payments.value.filter(
          payment => payment.customerId === currentUser.id
      );
    }
  } catch (err) {
    console.error("Error cargando payments:", err);
  }
});

function formatDate(dateStr) {
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
h2, p {
  color: #111111;
}
.payment-wrapper {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}
.payment-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
}
.payment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.payment-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.amount {
  font-size: 1.2rem;
  font-weight: bold;
  color: #b22222;
}
.status {
  font-size: 0.9rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  text-transform: capitalize;
}
.status.pending { background: #fff3cd; color: #856404; }
.status.paid {
  background: #d4edda; /* verde claro */
  color: #155724;      /* verde oscuro */
}

.status.completed { background: #d4edda; color: #155724; }
</style>