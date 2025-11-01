<template>
  <div class="profile-wrapper">
    <pv-card class="profile-card">
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-2xl"></i>
          <h2 class="m-0 title">{{ t('profile.title') }}</h2>
          <router-link to="/edit-profile">
            <pv-button icon="pi pi-pencil" size="small" />
          </router-link>
        </div>
      </template>

      <template #content>
        <div v-if="!loading && user" class="profile-info grid grid-reset">
          <div class="col-12 md:col-4 flex justify-content-center col-fix">
            <pv-avatar :image="avatarUrl" shape="circle" size="xlarge" class="shadow-2 border-circle" />
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
                <span class="info-label">{{ t('profile.country') }}</span>
                <span class="info-value">{{ user.country || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('profile.department') }}</span>
                <span class="info-value">{{ user.department || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('profile.paymentMethods') }}</span>
                <div v-for="method in payments" :key="method.id" class="payment-item">
                  <span class="info-value">
                    {{ method.type }} **** {{ String(method.number||'').slice(-4) }} (exp: {{ method.expiry }})
                  </span>
                </div>
                <a href="#" class="add-payment" @click.prevent="showDialog = true">
                  + {{ t('profile.addAnotherPayment') }}
                </a>
              </div>
              <div class="info-item">
                <span class="info-label">Created At</span>
                <span class="info-value">{{ createdAtText }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading">Loading…</div>

        <div class="mt-5" v-if="!loading">
          <h3 class="section">{{ t('profile.myProperties') }}</h3>

          <div class="grid grid-reset">
            <div v-for="property in userProps" :key="property.id" class="col-12 md:col-6 lg:col-4 col-fix">
              <pv-card class="property-card">
                <template #header>
                  <router-link :to="`/property/${property.id}`">
                    <img
                        :src="property.image || ('https://picsum.photos/300/200?random=' + property.id)"
                        alt="Property image"
                        class="property-image"
                    />
                  </router-link>
                </template>
                <template #content>
                  <h4 class="property-title">{{ property.name || ('Property ' + property.id) }}</h4>
                  <p class="property-address">{{ property.address }}</p>
                </template>
              </pv-card>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Dialog para agregar método de pago -->
    <pv-dialog v-model:visible="showDialog" modal :header="t('profile.addPaymentOption')" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label for="cardType">{{ t('profile.type') }}</label>
          <pv-dropdown id="cardType" v-model="newPayment.type" :options="cardTypes" optionLabel="label" optionValue="value" :placeholder="t('profile.type')" />
        </div>
        <div class="field">
          <label for="cardNumber">{{ t('profile.number') }}</label>
          <pv-input-mask id="cardNumber" v-model="newPayment.number" mask="9999 9999 9999 9999" placeholder="1234 5678 9012 3456" />
        </div>
        <div class="field">
          <label for="expiry">{{ t('profile.expiry') }}</label>
          <pv-input-mask id="expiry" v-model="newPayment.expiry" mask="99/99" placeholder="MM/YY" />
        </div>
        <div class="field">
          <label for="cvv">{{ t('profile.cvv') }}</label>
          <pv-input-mask id="cvv" v-model="newPayment.cvv" mask="999" placeholder="123" />
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
import { ref, onMounted, computed } from "vue";
import { useRentalStore } from "@/Rental/application/rental-store";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();


const { t } = useI18n();
const rental = useRentalStore();


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

onMounted(async () => {
  await Promise.all([
    rental.fetchAll("users"),
    rental.fetchAll("properties"),
  ]);

  user.value = rental.getLocalById("users", USER_ID) || null;
  loading.value = false;
});

const avatarUrl   = computed(() => user.value?.photo || "https://randomuser.me/api/portraits/men/75.jpg");
const payments    = computed(() => user.value?.paymentMethods ?? []);
const userProps   = computed(() => {
  const all = rental.list("properties").value ?? [];
  return all.filter(p => String(p.ownerId ?? p.userId) === String(USER_ID));
});
const createdAtText = computed(() => {
  const s = user.value?.createdAt;
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(+d) ? String(s) : d.toLocaleString("es-PE", {
    day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
  });
});

async function savePayment() {
  if (!user.value) return;
  const method = { id: Date.now(), ...newPayment.value };
  const next = {
    ...user.value,
    paymentMethods: [...(user.value.paymentMethods ?? []), method],
  };
  await rental.update("users", next);
  user.value = next;
  showDialog.value = false;
  newPayment.value = { type: "", number: "", expiry: "", cvv: "" };
}
</script>


<style scoped>

:global(html), :global(body), :global(#app) { background: #f9fafb; color: #111827; }
:root { color-scheme: light; }


.profile-wrapper{
  --sbw:260px;
  margin-left:var(--sbw);
  width:calc(100% - var(--sbw));
  padding:2rem;
  background:#f9fafb;
  min-height:100dvh;
  box-sizing:border-box;
  overflow-x:clip;
}


.profile-card{ width:100%; max-width:1000px; margin:0 auto; border-radius:16px; overflow:hidden; }
.profile-card, .p-card { background:#ffffff !important; color:#111827 !important; }
.title{ color:#111827; }
.section{ color:#111827; margin-bottom:1rem; }


.grid-reset{ margin-left:0 !important; margin-right:0 !important; }
.grid-reset > [class*="col-"]{ padding-left:0 !important; padding-right:0 !important; }
.col-fix{ min-width:0; }


.info-grid{ display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1.2rem; }
.info-item{ display:flex; flex-direction:column; padding:.5rem 0; border-bottom:1px solid #e5e7eb; }
.info-label{ font-size:.85rem; color:#6b7280; margin-bottom:.2rem; }
.info-value{ font-size:1.05rem; font-weight:500; color:#111827; }
.add-payment{ font-size:.85rem; color:#d32f2f; margin-top:.3rem; text-decoration:none; cursor:pointer; }
.loading{ padding:1rem 0; color:#111827; }


.property-card{ border-radius:12px; overflow:hidden; }
.property-image{ width:100%; height:180px; object-fit:cover; }
.property-title{ margin:.5rem 0 0; font-weight:600; color:#111827; }
.property-address{ margin:0; color:#6b7280; }


@media (max-width:1280px){
  .info-grid{ grid-template-columns:1fr; gap:1rem; }
}
@media (max-width:1024px){
  .profile-wrapper{ margin-left:0; width:100%; padding:1rem; }
}
</style>

