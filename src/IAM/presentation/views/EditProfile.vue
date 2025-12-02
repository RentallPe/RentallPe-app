<template>
  <div class="edit-profile-wrapper">
    <pv-card class="edit-profile-card">

      <!-- HEADER -->
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user-edit text-primary text-2xl"></i>
          <h2 class="m-0 text-black">{{ t('editProfile.title') }}</h2>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>
        <div v-if="loading">{{ t('common.loading') }}</div>

        <div v-else class="grid">

          <!-- FOTO -->
          <div class="col-12 md:col-4 flex flex-column align-items-center">
            <div class="image-placeholder" @click="() => fileInput.click()">
              <img :src="editUser.photo" class="avatar-preview" />
            </div>

            <input type="file" ref="fileInput" hidden @change="onPhotoChange" />

            <pv-button
                :label="t('editProfile.changePhoto')"
                icon="pi pi-image"
                class="mt-3"
                severity="info"
                @click="fileInput.click()"
            />
          </div>

          <!-- FORM -->
          <div class="col-12 md:col-8">

            <h3 class="text-black mb-3">{{ t('editProfile.profileInfo') }}</h3>

            <div class="info-grid">

              <div class="info-item">
                <label class="info-label">{{ t('editProfile.fullName') }}</label>
                <pv-input-text v-model="editUser.fullName" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t('editProfile.email') }}</label>
                <pv-input-text v-model="editUser.email" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t('editProfile.phone') }}</label>
                <pv-input-text v-model="editUser.phone" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t('editProfile.password') }}</label>
                <pv-input-text type="password" v-model="editUser.password" class="info-input"/>
              </div>

              <div class="info-item">
                <label class="info-label">{{ t('editProfile.role') }}</label>
                <pv-dropdown
                    v-model="editUser.role"
                    :options="['customer','provider','admin']"
                    class="info-input"
                    disabled
                />
              </div>

              <div v-if="editUser.role === 'provider'" class="info-item">
                <label class="info-label">{{ t('editProfile.providerId') }}</label>
                <pv-input-text v-model="editUser.providerId" class="info-input"/>
              </div>
            </div>

            <!-- MÉTODOS DE PAGO -->
            <h3 class="text-black mt-4">{{ t('editProfile.paymentMethods') }}</h3>

            <div v-if="editUser.paymentMethods.length === 0" class="muted">—</div>

            <div
                v-for="method in editUser.paymentMethods"
                :key="method.id"
                class="payment-item"
            >
              {{ method.type }} **** {{ String(method.number).slice(-4) }}
              (exp: {{ method.expiry }})

              <pv-button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="deletePayment(method.id)"
              />
            </div>

            <!-- ACCIONES -->
            <div class="flex justify-content-end mt-4 gap-2">
              <pv-button :label="t('common.cancel')" severity="secondary" @click="router.push('/profile')" />
              <pv-button :label="t('common.save')" severity="success" @click="saveUser" />
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useUserStore();

// Usuario dinámico desde localStorage
const saved = localStorage.getItem("currentUser");
const USER_ID = saved ? JSON.parse(saved).id : 1;


const user = ref(null);
const editUser = ref({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  providerId: "",
  photo: "https://randomuser.me/api/portraits/men/75.jpg",
  paymentMethods: [],
});

const loading = ref(true);
const saving  = ref(false);
const fileInput = ref(null);

onMounted(async () => {
  try {
    if (USER_ID) {
      user.value = await store.fetchUserById(USER_ID);
      if (!user.value) {
        await store.fetchUsers();
        user.value = store.users.find(u => String(u.id) === String(USER_ID)) || null;
      }
      if (user.value) {
        editUser.value = {
          fullName: user.value.fullName ?? "",
          email: user.value.email ?? "",
          phone: user.value.phone ?? "",
          password: user.value.password ?? "",
          role: user.value.role ?? "",
          providerId: user.value.providerId ?? "",
          photo: user.value.photo || "https://randomuser.me/api/portraits/men/75.jpg",
          paymentMethods: Array.isArray(user.value.paymentMethods)
              ? [...user.value.paymentMethods]
              : [],
        };
      }
    }
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
    // actualizar localStorage
    localStorage.setItem("currentUser", JSON.stringify(payload));
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

function onPhotoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    editUser.value.photo = reader.result; // base64
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.edit-profile-wrapper {
  padding: 2rem;
  padding-left: 260px;
  box-sizing: border-box;
  background-color: #f9fafb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.edit-profile-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 16px;
}

.image-placeholder {
  width: 100%;
  height: 220px;
  border: 2px dashed #b22222;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
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

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* Forzar texto negro en todo el card */
.edit-profile-card,
.edit-profile-card h1,
.edit-profile-card h2,
.edit-profile-card h3,
.edit-profile-card h4,
.edit-profile-card h5,
.edit-profile-card h6,
.edit-profile-card p,
.edit-profile-card label,
.edit-profile-card span,
.edit-profile-card strong,
.edit-profile-card div {
  color: #000 !important;
}

/* Inputs con fondo gris y texto negro */
.info-input {
  background-color: #e5e7eb; /* gris claro */
  color: #000; /* texto negro */
  border: 1px solid #ccc;
}

</style>