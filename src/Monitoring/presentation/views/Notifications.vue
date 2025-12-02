<template>
  <div class="notifications-wrapper">
    <pv-card class="notifications-card">
      <template #title>
        <div class="card-header">
          <div class="header-left">
            <i class="pi pi-bell header-icon"></i>
            <h2 class="header-title">{{ t('notifications.title') }}</h2>
          </div>
          <span class="badge">{{ filteredNotifications.length }}</span>
        </div>
      </template>

      <template #content>
        <div v-if="loading" class="state-text loading">
          <i class="pi pi-spin pi-spinner"></i>
          {{ t('notifications.loading') }}
        </div>

        <div v-else-if="error" class="state-text error">
          {{ t('notifications.error') }}: {{ error }}
        </div>

        <div v-else-if="!filteredNotifications.length" class="state-text empty">
          <i class="pi pi-inbox"></i>
          {{ t('notifications.noNotifications') }}
        </div>

        <div v-else class="notification-grid">
          <div
              v-for="n in filteredNotifications"
              :key="n.id"
              class="notification-item"
              :class="n.status || 'unread'"
          >
            <div class="notif-top">
              <div>
                <span class="notif-title">
                  {{ n.title || t('notifications.defaultTitle') }}
                </span>
                <span class="notif-date">
                  {{ formatDate(n.date || n.createdAt) }}
                </span>
              </div>

              <span class="status-chip">
                {{ t('notifications.status.' + (n.status || 'unread')) }}
              </span>
            </div>

            <p class="notif-message">
              {{ n.message }}
            </p>

            <div class="notif-actions">
              <pv-button
                  v-if="isProvider && n.title === t('notifications.confirmInstall')"
                  :label="t('notifications.confirmInstall')"
                  icon="pi pi-check"
                  severity="success"
                  size="small"
                  @click="confirmInstallation(n.paymentId)"
              />
              <pv-button
                  :label="t('notifications.delete')"
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  @click="deleteNotification(n.id)"
              />
            </div>

          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/IAM/application/user.store.js";
import { RentalApi } from "@/Rental/infrastructure/rental-api.js";

const { t } = useI18n();
const userStore = useUserStore();
const api = new RentalApi();

const loading = ref(true);
const error = ref("");
const notifications = ref([]);

const currentUser = computed(() => userStore.user);

onMounted(async () => {
  try {
    const res = await api.getEndpoint("notifications").getAll();
    notifications.value = res || [];
  } catch (e) {
    error.value = e?.message || "No se pudieron cargar las notificaciones";
  } finally {
    loading.value = false;
  }
});

const filteredNotifications = computed(() => {
  if (!currentUser.value) return [];
  if (currentUser.value.role === "provider") {
    return notifications.value.filter(n => String(n.providerId) === String(currentUser.value.providerId));
  }
  return notifications.value.filter(n => String(n.userId) === String(currentUser.value.id) ||
      String(n.customerId) === String(currentUser.value.id));
});
async function deleteNotification(id) {
  try {
    await api.getEndpoint("notifications").delete(id);
    // Quitar del array local
    notifications.value = notifications.value.filter(n => n.id !== id);
  } catch (e) {
    console.error("Error al eliminar notificación:", e);
    alert("No se pudo eliminar la notificación");
  }
}


function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
</script>

<style scoped>
.notifications-wrapper {
  padding: 2rem;
  background: linear-gradient(180deg, #f9fafb, #f3f4f6);
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.notifications-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

/* HEADER */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-icon {
  font-size: 1.6rem;
  color: #b22222;
}

.header-title {
  margin: 0;
  font-weight: 800;
  color: #000;
}

.badge {
  background: #b22222;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

/* STATES */
.state-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  padding: 2rem 0;
  color: #777;
}

.state-text.empty i {
  font-size: 1.4rem;
}

/* GRID */
.notification-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ITEM */
.notification-item {
  background: #fafafa;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  border: 1px solid #eee;
  transition: all 0.2s ease;
}

.notification-item:hover {
  transform: translateY(-2px);
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

/* STATUS */
.notification-item.unread {
  border-left: 4px solid #b22222;
}

.notification-item.read {
  opacity: 0.85;
}

/* TOP */
.notif-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.notif-title {
  font-weight: 700;
  color: #111;
  display: block;
}

.notif-date {
  font-size: 0.75rem;
  color: #888;
}

/* CHIP */
.status-chip {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #eee;
  color: #555;
  font-weight: 600;
}

/* MESSAGE */
.notif-message {
  margin: 0.3rem 0 0.6rem;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* ACTIONS */
.notif-actions {
  display: flex;
  justify-content: flex-end;
}
.notif-actions .p-button {
  margin-left: 0.5rem;
}
</style>