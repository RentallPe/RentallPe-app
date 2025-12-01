<template>
  <div class="profile-wrapper">
    <pv-card class="profile-card glass">

      <!-- HEADER -->
      <template #title>
        <div class="profile-header">
          <div class="flex align-items-center gap-3">
            <i class="pi pi-user profile-icon"></i>
            <h2 class="title">{{ t('profile.title') }}</h2>
          </div>

          <router-link to="/edit-profile">
            <pv-button icon="pi pi-pencil" size="small" rounded />
          </router-link>
        </div>
      </template>

      <template #content>

        <!-- INFO GENERAL -->
        <div v-if="!loading && user" class="profile-info grid grid-reset">
          <div class="col-12 md:col-4 flex justify-content-center col-fix">
            <pv-avatar
                :image="avatarUrl"
                shape="circle"
                size="xlarge"
                class="profile-avatar"
            />
          </div>

          <div class="col-12 md:col-8 col-fix">
            <h3 class="section">{{ t('profile.information') }}</h3>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ t('profile.name') }}</span>
                <span class="info-value">{{ user.fullName || '—' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email || '—' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">{{ t('profile.phone') }}</span>
                <span class="info-value">{{ user.phone || '—' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Role</span>
                <span class="info-value role-badge">{{ user.role }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Created At</span>
                <span class="info-value">{{ createdAtText }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading">Loading…</div>

        <!-- ================= CUSTOMER ================= -->
        <div class="mt-6" v-if="!loading && user?.role === 'customer'">

          <h3 class="section">{{ t('profile.paymentMethods') }}</h3>

          <div class="payment-box">
            <div v-if="!payments || payments.length === 0" class="muted">—</div>

            <div
                v-for="method in payments"
                :key="method.id"
                class="payment-item"
            >
              💳 {{ method.type }} **** {{ String(method.number||'').slice(-4) }}
              <span class="expiry">(exp: {{ method.expiry }})</span>
            </div>

            <a
                href="#"
                class="add-payment"
                @click.prevent="showDialog = true"
            >+ {{ t('profile.addAnotherPayment') }}</a>
          </div>

          <!-- PROPIEDADES -->
          <h3 class="section mt-6">{{ t('profile.myProperties') }}</h3>

          <div class="grid grid-reset">
            <div
                v-if="!userProps || userProps.length === 0"
                class="muted"
            >
              No properties yet.
            </div>

            <div
                v-for="property in userProps"
                :key="property.id"
                class="col-12 md:col-6 lg:col-4 col-fix"
            >
              <pv-card class="property-card hover-card">
                <template #header>
                  <router-link :to="`/property/${property.id}`">
                    <img
                        :src="property.image || ('https://picsum.photos/300/200?random=' + property.id)"
                        class="property-image"
                    />
                  </router-link>
                </template>

                <template #content>
                  <h4 class="property-title">
                    {{ property.name || ('Property ' + property.id) }}
                  </h4>
                  <p class="property-address">{{ property.address }}</p>
                </template>
              </pv-card>
            </div>
          </div>

          <div class="flex justify-content-end mt-4">
            <router-link to="/add-property">
              <pv-button
                  :label="t('profile.addProperty')"
                  icon="pi pi-plus"
                  severity="success"
                  class="soft-btn"
              />
            </router-link>
          </div>
        </div>

        <!-- ================= PROVIDER ================= -->
        <div class="mt-6" v-if="!loading && user?.role === 'provider'">

          <h3 class="section">My Combos</h3>

          <div class="grid grid-reset">
            <div
                v-if="!providerCombos || providerCombos.length === 0"
                class="muted"
            >
              No combos yet.
            </div>

            <div
                v-for="combo in providerCombos"
                :key="combo.id"
                class="col-12 md:col-6 lg:col-4 col-fix"
            >
              <pv-card class="combo-card hover-card">

                <template #header>
                  <router-link :to="`/combo/${combo.id}`">
                    <img
                        :src="combo.image || ('https://picsum.photos/400/250?random=' + combo.id)"
                        class="combo-image"
                    />
                  </router-link>
                </template>

                <template #content>
                  <h4 class="combo-title">
                    {{ combo.name }}

                    <span v-if="combo.planType === 'premium'" class="badge premium">
                      Premium
                    </span>

                    <span v-if="combo.planType === 'enterprise'" class="badge enterprise">
                      Enterprise
                    </span>
                  </h4>

                  <p class="combo-description">{{ combo.description }}</p>

                  <p class="combo-price">
                    <strong>${{ combo.price }}</strong>
                  </p>
                </template>

              </pv-card>
            </div>
          </div>

          <div class="flex justify-content-end mt-4">
            <router-link to="/add-combo">
              <pv-button label="Add Combo" icon="pi pi-plus" severity="success" class="soft-btn" />
            </router-link>
          </div>

        </div>
      </template>
    </pv-card>

    <!-- ================= DIALOG PAGO ================= -->
    <pv-dialog
        v-model:visible="showDialog"
        modal
        :header="t('profile.addPaymentOption')"
        :style="{ width: '420px' }"
        class="glass"
    >
      <div class="p-fluid">
        <div class="field">
          <label>{{ t('profile.type') }}</label>
          <pv-dropdown v-model="newPayment.type" :options="cardTypes"
                       optionLabel="label" optionValue="value" />
        </div>

        <div class="field">
          <label>{{ t('profile.number') }}</label>
          <pv-input-mask v-model="newPayment.number" mask="9999 9999 9999 9999" />
        </div>

        <div class="field">
          <label>{{ t('profile.expiry') }}</label>
          <pv-input-mask v-model="newPayment.expiry" mask="99/99" />
        </div>

        <div class="field">
          <label>{{ t('profile.cvv') }}</label>
          <pv-input-mask v-model="newPayment.cvv" mask="999" />
        </div>
      </div>

      <template #footer>
        <pv-button :label="t('profile.cancel')" severity="secondary" />
        <pv-button :label="t('profile.accept')" severity="success" @click="savePayment" />
      </template>
    </pv-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/IAM/application/user.store.js";
import { usePropertyStore } from "@/Property/application/property-store.js";
import { useProviderStore } from "@/Provider/application/provider-store.js";

const { t } = useI18n();
const store = useUserStore();
const propertyStore = usePropertyStore();
const providerStore = useProviderStore();

// Usuario dinámico desde localStorage
const saved = localStorage.getItem("currentUser");
const USER_ID = saved ? JSON.parse(saved).id : 1;

const user       = ref(null);
const loading    = ref(true);
const showDialog = ref(false);

const newPayment = ref({ type: "", number: "", expiry: "", cvv: "" });
const cardTypes  = [
  { label: "Visa", value: "Visa" },
  { label: "MasterCard", value: "MasterCard" },
];

// Cargar datos
onMounted(async () => {
  try {
    user.value = await store.fetchUserById(USER_ID);
    if (!user.value) {
      await store.fetchUsers();
      user.value = store.users.find(u => String(u.id) === String(USER_ID)) || null;
    }
    await propertyStore.fetchProperties();
    await providerStore.fetchCombos();
  } finally {
    loading.value = false;
  }
});

// Computed seguros
const avatarUrl   = computed(() => user.value?.photo || "https://randomuser.me/api/portraits/men/75.jpg");
const payments    = computed(() => user.value?.paymentMethods ?? []);
const userProps = computed(() => {
  const allProperties = propertyStore.properties ?? [];
  if (!user.value) return [];
  return allProperties.filter(
      p => String(p.ownerId) === String(user.value.id)
  );
});

const providerCombos = computed(() => {
  const u = user.value;
  if (!u || u.role !== "provider") return [];
  return providerStore.combos.filter(c => String(c.providerId) === String(u.providerId));
});
const createdAtText = computed(() => {
  const s = user.value?.createdAt;
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(+d)
      ? String(s)
      : d.toLocaleString("es-PE", {
        day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
      });
});

// Guardar método de pago
async function savePayment() {
  if (!user.value) return;
  const method = { id: Date.now(), ...newPayment.value };
  const next = {
    ...user.value,
    paymentMethods: [...(user.value.paymentMethods ?? []), method],
  };
  await store.updateUser(next);
  user.value = next;
  showDialog.value = false;
  newPayment.value = { type: "", number: "", expiry: "", cvv: "" };
}
</script>


<style scoped>
.profile-wrapper{
  padding:2rem;
  background:linear-gradient(135deg,#f8fafc,#eef2f7);
  min-height:100vh;
}

.profile-card {
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background-color: #ffffff !important; /* 👈 fuerza fondo blanco */
}
.profile-card :deep(.p-card-body),
.profile-card :deep(.p-card-content),
.profile-card :deep(.p-card-title) {
  background-color: #ffffff !important;
}


/* HEADER */
.profile-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.profile-icon{
  font-size:2rem;
  color:#b91c1c;
}

.title{
  margin:0;
  font-weight:700;
}

/* AVATAR */
.profile-avatar{
  box-shadow:0 0 0 6px rgba(185,28,28,.15), 0 15px 40px rgba(0,0,0,.2);
}

/* INFO GRID */
.info-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:1.2rem;
}

.info-item{
  display:flex;
  flex-direction:column;
  padding:.6rem;
  border-radius:12px;
  background:#f9fafb;
}

.info-label{
  font-size:.8rem;
  color:#6b7280;
}

.info-value{
  font-weight:600;
  color:#111827;
}

/* ROLE */
.role-badge{
  text-transform:capitalize;
  background:#fee2e2;
  color:#991b1b;
  padding:.15rem .6rem;
  border-radius:999px;
  width:fit-content;
}

/* HOVER CARDS */
.hover-card{
  transition:.25s;
}
.hover-card:hover{
  transform:translateY(-6px);
  box-shadow:0 15px 30px rgba(0,0,0,.15);
}

/* PROPERTY */
.property-image,.combo-image{
  height:180px;
  object-fit:cover;
}

.property-title,.combo-title{
  font-weight:700;
  margin:.5rem 0 0;
}

/* BADGES */
.badge{
  font-size:.7rem;
  padding:.15rem .6rem;
  border-radius:999px;
  margin-left:.4rem;
}
.badge.premium{
  background:linear-gradient(135deg,gold,orange);
  color:#000;
}
.badge.enterprise{
  background:linear-gradient(135deg,#2563eb,#3b82f6);
  color:#fff;
}

/* PAYMENT */
.payment-box{
  background:#f9fafb;
  border-radius:14px;
  padding:1rem;
}
.payment-item{
  padding:.25rem 0;
  font-weight:500;
}
.expiry{
  color:#6b7280;
  font-size:.85rem;
}

/* BUTTONS */
.soft-btn{
  border-radius:999px;
  padding:.6rem 1.4rem;
}

/* RESPONSIVE */
@media (max-width:900px){
  .info-grid{grid-template-columns:1fr;}
}
.profile-card {
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background-color: #ffffff !important;
  color: #111111 !important;
}


.profile-card h2,
.profile-card h3,
.profile-card h4,
.profile-card p
 {
  color: #111111 ;
}
.role-badge{
  text-transform:capitalize;
  background:#fee2e2;
  color:#991b1b;
  padding:.15rem .6rem;
  border-radius:999px;
  width:fit-content;
}
</style>