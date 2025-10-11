<template>
  <div class="profile-wrapper">
    <pv-card class="profile-card">

      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-primary text-2xl"></i>
          <h2 class="m-0 text-black">My Profile</h2>

          <router-link to="/edit-profile">
            <pv-button icon="pi pi-pencil" size="small" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div class="profile-info grid">

          <div class="col-12 md:col-4 flex justify-content-center">
            <pv-avatar
                :image="user.photo || 'https://randomuser.me/api/portraits/men/75.jpg'"
                shape="circle"
                size="xlarge"
                class="shadow-2 border-circle"
            />
          </div>


          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">Information</h3>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{ user.fullName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone</span>
                <span class="info-value">{{ user.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Created At</span>
                <span class="info-value">{{ user.createdAt }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Methods</span>
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
                  + Add another payment method
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <h3 class="text-black mb-3">My Properties</h3>

          <div class="grid">
            <div
                v-for="property in user.properties"
                :key="property.id"
                class="col-12 md:col-6 lg:col-4"
            >
              <pv-card class="property-card">
                <template #header>
                  <router-link :to="`/property/${property.id}`">
                    <img
                        :src="property.image || 'https://picsum.photos/300/200?random=' + property.id"
                        alt="Property image"
                        class="property-image"
                    />
                  </router-link>
                </template>
                <template #content>
                  <h4 class="m-0">{{ property.name || 'Property ' + property.id }}</h4>
                  <p class="text-600 text-sm">{{ property.address }}</p>
                </template>
              </pv-card>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="showDialog" modal header="Add Payment Option" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="cardType">Type</label>
          <pv-dropdown
              id="cardType"
              v-model="newPayment.type"
              :options="cardTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select card type"
          />
        </div>
        <div class="field">
          <label for="cardNumber">Number</label>
          <pv-input-mask
              id="cardNumber"
              v-model="newPayment.number"
              mask="9999 9999 9999 9999"
              placeholder="1234 5678 9012 3456"
          />
        </div>
        <div class="field">
          <label for="expiry">Expiration Date</label>
          <pv-input-mask
              id="expiry"
              v-model="newPayment.expiry"
              mask="99/99"
              placeholder="MM/YY"
          />
        </div>
        <div class="field">
          <label for="cvv">Security Code</label>
          <pv-input-mask
              id="cvv"
              v-model="newPayment.cvv"
              mask="999"
              placeholder="123"
          />
        </div>
      </div>

      <template #footer>
        <pv-button label="Cancel" severity="danger" @click="showDialog = false" />
        <pv-button label="Accept" severity="success" @click="savePayment" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { UserAssembler } from "@/Rental/infrastructure/user.assembler.js";

const user = ref({});
const showDialog = ref(false);

const newPayment = ref({
  type: "",
  number: "",
  expiry: "",
  cvv: ""
});
const cardTypes = [
  {label: "Visa", value: "Visa"},
  {label: "MasterCard", value: "MasterCard"},
];

onMounted(async () => {
  const response = await axios.get("http://localhost:3000/users/1");
  user.value = UserAssembler.toEntityFromResource(response.data);

  user.value.paymentMethods = response.data.paymentMethods || [];
  user.value.properties = response.data.properties || [];
});

async function savePayment() {
  const newMethod = {
    id: Date.now(),
    ...newPayment.value
  };

  await axios.patch("http://localhost:3000/users/1", {
    paymentMethods: [...user.value.paymentMethods, newMethod]
  });

  user.value.paymentMethods.push(newMethod);

  showDialog.value = false;
  newPayment.value = {type: "", number: "", expiry: "", cvv: ""};
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
</style>