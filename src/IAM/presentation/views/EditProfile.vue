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
        <!-- grid sin desbordes -->
        <div class="grid grid-reset">
          <!-- Avatar -->
          <div class="col-12 md:col-4 flex flex-column align-items-center col-fix">
            <img :src="editUser.photo" alt="Profile photo" class="avatar-large" />
            <pv-button label="Change profile pic" icon="pi pi-image" class="mt-3" severity="info" />
          </div>

          <!-- Formulario -->
          <div class="col-12 md:col-8 col-fix">
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
                  <pv-button icon="pi pi-trash" severity="danger" text size="small" @click="deletePayment(method.id)" />
                </div>
              </div>
            </div>

            <div class="actions mt-4">
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
import { useRouter } from "vue-router";
import { useUserStore } from "@/IAM/application/user.store.js";

const router = useRouter();
const store = useUserStore();

const USER_ID = 1;

const user = ref(null);
const editUser = ref({
  fullName: "",
  email: "",
  phone: "",
  photo: "",
  paymentMethods: [],
});

const loading = ref(true);
const saving  = ref(false);

onMounted(async () => {
  try {
    user.value = await store.fetchUserById(USER_ID);
    if (!user.value) throw new Error("Usuario no encontrado");

    editUser.value = {
      fullName: user.value.fullName ?? "",
      email: user.value.email ?? "",
      phone: user.value.phone ?? "",
      photo: user.value.photo || "https://randomuser.me/api/portraits/men/75.jpg",
      paymentMethods: Array.isArray(user.value.paymentMethods)
          ? [...user.value.paymentMethods]
          : [],
    };
  } catch (e) {
    console.error("Error al cargar usuario:", e);
  } finally {
    loading.value = false;
  }
});

async function saveUser() {
  if (!user.value) return;
  saving.value = true;
  try {
    const payload = {
      ...user.value,
      ...editUser.value,
      id: user.value.id,
    };
    await store.updateUser(payload);
    router.push("/profile");
  } catch (e) {
    console.error("[edit-profile] save error:", e);
    alert("No se pudieron guardar los cambios.");
  } finally {
    saving.value = false;
  }
}

function deletePayment(id) {
  editUser.value.paymentMethods = editUser.value.paymentMethods.filter(m => m.id !== id);
}
</script>

<style scoped>

.edit-profile-wrapper {
  --sbw: 260px;
  margin-left: var(--sbw);
  width: calc(100% - var(--sbw));
  padding: 2rem;
  box-sizing: border-box;
  min-height: 100dvh;
  background-color: #f9fafb;
  overflow-x: clip;
}


.edit-profile-card {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}


.grid-reset { margin-left: 0 !important; margin-right: 0 !important; }
.grid-reset > [class*="col-"] { padding-left: 0 !important; padding-right: 0 !important; }


.col-fix { min-width: 0; }


.avatar-large {
  width: 140px; height: 140px; border-radius: 50%;
  object-fit: cover; max-width: 100%;
  box-shadow: 0 2px 6px rgba(0,0,0,.15);
}


.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
}
.info-item { display: flex; flex-direction: column; padding: .5rem 0; }
.info-label { font-size: .85rem; color: #6b7280; margin-bottom: .3rem; }
.info-input { width: 100%; font-size: 1rem; padding: .6rem; }
.info-value { font-size: 1rem; font-weight: 500; color: #111827; }
.payment-item { padding: .4rem 0; border-bottom: 1px solid #eee; }

.actions { display: flex; flex-wrap: wrap; gap: .75rem; }


@media (max-width: 1280px) {
  .info-grid { grid-template-columns: 1fr; gap: 1rem; }
  .avatar-large { width: 110px; height: 110px; }
}


@media (max-width: 1024px) {
  .edit-profile-wrapper { padding: 1rem; }
  .edit-profile-card { border-radius: 12px; }
  .avatar-large { width: 96px; height: 96px; }
}
</style>

