<template>
  <div class="profile-wrapper">
    <pv-card class="profile-card">
      <!-- Título -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('profile.title') }}</h2>
          <router-link to="/edit-profile">
            <pv-button icon="pi pi-pencil" size="small" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div class="profile-info grid">
          <!-- Avatar -->
          <div class="col-12 md:col-4 flex justify-content-center">
            <pv-avatar
                :image="user.photo"
                shape="circle"
                size="xlarge"
                class="shadow-2 border-circle"
            />
          </div>

          <!-- Información -->
          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">{{ t('profile.information') }}</h3>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ t('profile.name') }}</span>
                <span class="info-value">{{ user.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('profile.country') }}</span>
                <span class="info-value">{{ user.country }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('profile.department') }}</span>
                <span class="info-value">{{ user.department }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('profile.paymentMethods') }}</span>
                <div
                    v-for="method in user.paymentMethods"
                    :key="method.id"
                    class="payment-item"
                >
                  <span class="info-value">
                    {{ method.type }} **** {{ method.number.slice(-4) }} (exp: {{ method.expiry }})
                  </span>
                </div>
                <a href="#" class="add-payment" @click.prevent="showDialog = true">
                  + {{ t('profile.addAnotherPayment') }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Propiedades -->
        <div class="mt-5">
          <h3 class="text-black mb-3">{{ t('profile.myProperties') }}</h3>

          <div class="grid">
            <div
                v-for="property in user.properties"
                :key="property.id"
                class="col-12 md:col-6 lg:col-4"
            >
              <pv-card class="property-card">
                <template #header>
                  <router-link :to="`/property/${property.id}`">
                    <img :src="property.image" alt="Property image" class="property-image" />
                  </router-link>
                </template>
                <template #content>
                  <h4 class="m-0">{{ property.name }}</h4>
                  <p class="text-600 text-sm">{{ property.address }}</p>
                </template>
              </pv-card>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Diálogo para añadir método de pago -->
    <pv-dialog v-model:visible="showDialog" modal :header="t('profile.addPaymentOption')" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="cardType">{{ t('profile.type') }}</label>
          <pv-dropdown
              id="cardType"
              v-model="newPayment.type"
              :options="cardTypes"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('profile.type')"
          />
        </div>
        <div class="field">
          <label for="cardNumber">{{ t('profile.number') }}</label>
          <pv-input-mask
              id="cardNumber"
              v-model="newPayment.number"
              mask="9999 9999 9999 9999"
              placeholder="1234 5678 9012 3456"
          />
        </div>
        <div class="field">
          <label for="expiry">{{ t('profile.expiry') }}</label>
          <pv-input-mask
              id="expiry"
              v-model="newPayment.expiry"
              mask="99/99"
              placeholder="MM/YY"
          />
        </div>
        <div class="field">
          <label for="cvv">{{ t('profile.cvv') }}</label>
          <pv-input-mask
              id="cvv"
              v-model="newPayment.cvv"
              mask="999"
              placeholder="123"
          />
        </div>
      </div>

      <template #footer>
        <pv-button :label="t('profile.cancel')" severity="danger" @click="showDialog = false" />
        <pv-button :label="t('profile.accept')" severity="success" @click="savePayment" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const user = ref({});
const showDialog = ref(false);

const newPayment = ref({
  type: "",
  number: "",
  expiry: "",
  cvv: ""
});

const cardTypes = [
  { label: "Visa", value: "Visa" },
  { label: "MasterCard", value: "MasterCard" }
];

onMounted(async () => {
  const res = await fetch("http://localhost:3000/user");
  const data = await res.json();
  user.value = data;
});

async function savePayment() {
  const newMethod = {
    id: Date.now(),
    ...newPayment.value
  };

  await fetch("http://localhost:3000/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentMethods: [...user.value.paymentMethods, newMethod]
    })
  });

  user.value.paymentMethods.push(newMethod);

  showDialog.value = false;
  newPayment.value = { type: "", number: "", expiry: "", cvv: "" };
}
</script>
<style scoped>
.profile-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.profile-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}

.property-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.text-black {
  color: #000;
}

/* Info */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #111827;
}

.add-payment {
  font-size: 0.85rem;
  color: #d32f2f;
  margin-top: 0.3rem;
  text-decoration: none;
  cursor: pointer;
}
.p-card {
  background: #ffffff;
}
p{
  color: #111111;
}
.m-0{
  color: #303030;
}
.text-600 {
  color: #000000 !important;
}
</style>