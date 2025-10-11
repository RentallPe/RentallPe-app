<template>
  <div class="billing-wrapper">
    <pv-card class="profile-card">
      <template #title>
        <h2 class="page-title">{{ t('billing.title') }}</h2>
      </template>

      <template #content>
        <div class="grid">
          <div
              v-for="(payment, index) in pendingPayments"
              :key="index"
              class="col-12 md:col-6 lg:col-4"
          >
            <pv-card class="billing-card">
              <template #title>
                <h3 class="m-0 text-black">{{ payment.propertyName }}</h3>
              </template>

              <template #content>
                <p class="text-black"><strong>{{ t('billing.address') }}:</strong> {{ payment.address }}</p>
                <p class="text-black"><strong>{{ t('billing.installment') }}:</strong> {{ payment.installment }}</p>
                <p class="text-black"><strong>{{ t('billing.amount') }}:</strong> S/. {{ payment.amount }}</p>
                <p class="text-black"><strong>{{ t('billing.dueDate') }}:</strong> {{ payment.maturityDate }}</p>
              </template>
            </pv-card>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRentalStore } from "@/Rental/application/rental-store";

const { t } = useI18n();
const rental = useRentalStore();

onMounted(async () => {
  
  await Promise.all([
    rental.fetchAll("payments"),
    rental.fetchAll("projects"),
    rental.fetchAll("properties"),
  ]);
});

const payments  = rental.list("payments");
const projects  = rental.list("projects");
const properties = rental.list("properties");

function formatDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}


const pendingPayments = computed(() => {
  const ps = payments.value || [];
  const pr = projects.value || [];
  const pp = properties.value || [];

  const mapped = ps
    .filter(p => (p.status || "").toLowerCase() !== "paid") 
    .map(p => {
      const proj = pr.find(x => String(x.id) === String(p.projectId)) || {};
      const prop = pp.find(x => String(x.id) === String(proj.propertyId)) || {};
      return {
        propertyName: prop.name || (prop.id ? `Property ${prop.id}` : "Property"),
        address: prop.address || "",
        installment: p.installment ?? 1,
        amount: p.amount,
        maturityDate: formatDate(p.date || p.maturityDate),
      };
    });

  return mapped;
});
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
.p-component{
  background-color: #fff;
}
</style>