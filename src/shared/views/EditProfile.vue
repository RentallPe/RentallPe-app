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
        <div v-if="loading" class="loading">Loading…</div>

        <div v-else class="grid grid-reset">

          <div class="col-12 md:col-4 flex flex-column align-items-center col-fix">
            <img :src="editUser.photo || fallbackAvatar" alt="Profile photo" class="avatar-large" />
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelected" />
            <pv-button
                label="Change profile pic"
                icon="pi pi-image"
                class="mt-3"
                severity="info"
                @click="fileInput?.click()"
            />
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
                    {{ method.type }} **** {{ String(method.number || '').slice(-4) }} (exp: {{ method.expiry || '—' }})
                  </span>
                  <pv-button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      size="small"
                      @click="deletePayment(method.id)"
                  />
                </div>

                <pv-button
                    label="+ Add payment method"
                    text
                    icon="pi pi-plus"
                    class="mt-2"
                    @click="showDialog = true"
                />
              </div>
            </div>

            <div class="actions mt-4">
              <pv-button
                  label="Save"
                  severity="success"
                  :disabled="!isValid || !isDirty || saving"
                  :loading="saving"
                  @click="saveUser"
              />
              <router-link to="/profile">
                <pv-button label="Cancel" severity="danger" :disabled="saving" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Dialog para agregar método de pago -->
        <pv-dialog v-model:visible="showDialog" modal header="Add payment method" :style="{ width: '420px' }">
          <div class="p-fluid">
            <div class="field">
              <label for="cardType">Type</label>
              <pv-dropdown
                  id="cardType"
                  v-model="newPayment.type"
                  :options="cardTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Type"
              />
            </div>
            <div class="field">
              <label for="cardNumber">Number</label>
              <pv-input-mask id="cardNumber" v-model="newPayment.number" mask="9999 9999 9999 9999" placeholder="1234 5678 9012 3456" />
            </div>
            <div class="field">
              <label for="expiry">Expiry</label>
              <pv-input-mask id="expiry" v-model="newPayment.expiry" mask="99/99" placeholder="MM/YY" />
            </div>
            <div class="field">
              <label for="cvv">CVV</label>
              <pv-input-mask id="cvv" v-model="newPayment.cvv" mask="999" placeholder="123" />
            </div>
          </div>

          <template #footer>
            <pv-button label="Cancel" severity="danger" @click="showDialog = false" />
            <pv-button label="Add" severity="success" @click="addPayment" />
          </template>
        </pv-dialog>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRentalStore } from '@/Rental/application/rental-store';

const router = useRouter();
const rental = useRentalStore();

const saved = localStorage.getItem('currentUser');
const USER_ID = saved ? JSON.parse(saved).id : 1;

const user = ref(null);
const editUser = ref({
  fullName: '',
  email: '',
  phone: '',
  photo: '',
  paymentMethods: [],
});

const loading = ref(true);
const saving  = ref(false);

const fallbackAvatar = 'https://randomuser.me/api/portraits/men/75.jpg';

const fileInput  = ref(null);
const showDialog = ref(false);
const newPayment = ref({ type: '', number: '', expiry: '', cvv: '' });
const cardTypes  = [
  { label: 'Visa', value: 'Visa' },
  { label: 'MasterCard', value: 'MasterCard' },
];


onMounted(async () => {
  await rental.fetchAll('users');
  let u = rental.getLocalById('users', USER_ID);
  if (!u) {
    u = await rental.fetchById('users', USER_ID);
  }
  if (!u) {
    console.error('Usuario no existe en backend');
    loading.value = false;
    return;
  }

  user.value = u;
  editUser.value = {
    fullName: u.fullName ?? '',
    email: u.email ?? '',
    phone: u.phone ?? '',
    photo: u.photo || fallbackAvatar,
    paymentMethods: Array.isArray(u.paymentMethods) ? [...u.paymentMethods] : [],
  };

  loading.value = false;
});


const isValid = computed(() => {
  const emailOk =
      !editUser.value.email ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.value.email);
  const nameOk = (editUser.value.fullName || '').trim().length >= 2;
  return emailOk && nameOk;
});

const isDirty = computed(() => {
  if (!user.value) return false;
  const cur = {
    fullName: user.value.fullName ?? '',
    email: user.value.email ?? '',
    phone: user.value.phone ?? '',
    photo: user.value.photo || fallbackAvatar,
    paymentMethods: Array.isArray(user.value.paymentMethods) ? user.value.paymentMethods : [],
  };
  const next = {
    fullName: editUser.value.fullName ?? '',
    email: editUser.value.email ?? '',
    phone: editUser.value.phone ?? '',
    photo: editUser.value.photo || fallbackAvatar,
    paymentMethods: Array.isArray(editUser.value.paymentMethods) ? editUser.value.paymentMethods : [],
  };
  return JSON.stringify(cur) !== JSON.stringify(next);
});

async function saveUser() {
  if (!user.value || !isValid.value || !isDirty.value) return;
  saving.value = true;
  try {

    const normalizedPM = (editUser.value.paymentMethods || []).map(pm => ({
      id: pm.id ?? Date.now() + Math.floor(Math.random() * 1000),
      type: pm.type ?? '',
      number: pm.number ?? '',
      expiry: pm.expiry ?? '',
      cvv: pm.cvv ?? '',
    }));

    const payload = {
      ...user.value,
      ...editUser.value,
      id: user.value.id,
      paymentMethods: normalizedPM,
    };

    const updated = await rental.update('users', payload);


    user.value = updated || payload;

    try {
      const savedRaw = localStorage.getItem('currentUser');
      if (savedRaw) {
        const savedObj = JSON.parse(savedRaw);
        const merged = { ...savedObj, ...user.value };
        localStorage.setItem('currentUser', JSON.stringify(merged));
      }
    } catch {}

    router.push('/profile');
  } catch (e) {
    console.error('[edit-profile] save error:', e);
    alert('No se pudieron guardar los cambios.');
  } finally {
    saving.value = false;
  }
}

function deletePayment(id) {
  editUser.value.paymentMethods = (editUser.value.paymentMethods || []).filter(m => m.id !== id);
}

function addPayment() {
  const pm = { id: Date.now(), ...newPayment.value };
  editUser.value.paymentMethods = [...(editUser.value.paymentMethods || []), pm];
  newPayment.value = { type: '', number: '', expiry: '', cvv: '' };
  showDialog.value = false;
}

function onPhotoSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    editUser.value.photo = String(reader.result || '');
  };
  reader.readAsDataURL(file);
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
.loading{ padding:1rem 0; color:#111827; }
.hidden{ display:none; }

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
