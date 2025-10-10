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
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const pendingPayments = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/user");
  const user = await res.json();

  pendingPayments.value = user.payments || [
    {
      propertyName: "Urban Cottage",
      address: "Fifth Avenue 1412, Sienna, Lima",
      installment: 1,
      amount: 1200,
      maturityDate: "12/11/2023"
    },
    {
      propertyName: "Hillside Home",
      address: "Palm Avenue 1412, Miraflores, Lima",
      installment: 1,
      amount: 3000,
      maturityDate: "20/10/2023"
    }
  ];
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