<template>
  <div class="edit-profile-wrapper">
    <pv-card class="edit-profile-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user-edit text-primary text-2xl"></i>
          <h2 class="m-0 text-black">Editing my profile</h2>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Avatar -->
          <div class="col-12 md:col-4 flex flex-column align-items-center">
            <img :src="editUser.photo" alt="Profile photo" class="avatar-large" />
            <pv-button
                label="Change profile pic"
                icon="pi pi-image"
                class="mt-3"
                severity="info"
            />
          </div>

          <!-- Información editable -->
          <div class="col-12 md:col-8">
            <h3 class="text-black mb-3">Information</h3>

            <div class="info-grid">
              <div class="info-item">
                <label class="info-label" for="fullName">Name</label>
                <pv-input-text id="fullName" v-model="editUser.fullName" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="email">Email</label>
                <pv-input-text id="email" v-model="editUser.email" class="info-input" />
              </div>
              <div class="info-item">
                <label class="info-label" for="phone">Phone</label>
                <pv-input-text id="phone" v-model="editUser.phone" class="info-input" />
              </div>

              <!-- Métodos de pago -->
              <div class="info-item">
                <label class="info-label">Payment Methods</label>
                <div
                    v-for="method in editUser.paymentMethods"
                    :key="method.id"
                    class="payment-item flex align-items-center justify-content-between"
                >
                  <span class="info-value">
                    {{ method.type }} **** {{ method.number.slice(-4) }} (exp: {{ method.expiry }})
                  </span>
                  <pv-button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      size="small"
                      @click="deletePayment(method.id)"
                  />
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-2 mt-4">
              <pv-button label="Save" severity="success" @click="saveUser" />
              <router-link to="/profile">
                <pv-button label="Cancel" severity="danger" />
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref({});
const editUser = ref({});

onMounted(async () => {
  const res = await fetch("http://localhost:3000/users/1");
  const data = await res.json();
  user.value = data;
  editUser.value = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    photo: data.photo || "https://randomuser.me/api/portraits/men/75.jpg",
    paymentMethods: data.paymentMethods || []
  };
});

async function saveUser() {
  await fetch("http://localhost:3000/users/1", {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(editUser.value)
  });
  window.location.href = "/profile";
}

function deletePayment(id) {
  editUser.value.paymentMethods = editUser.value.paymentMethods.filter(m => m.id !== id);
}
</script>

<style scoped>
.edit-profile-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
  min-height: 100vh;
}

.edit-profile-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}

.avatar-large {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
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
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
}

.info-input {
  font-size: 1rem;
  padding: 0.6rem;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.payment-item {
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}
</style>