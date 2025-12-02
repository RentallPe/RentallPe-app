<template>
  <aside class="sidebar">

    <!-- LOGO -->
    <div class="sidebar-logo">
      <img src="@/assets/logo-rentalpe.png" alt="RentallPe Logo" class="logo-img" />
      <span class="logo-text">RentallPe</span>
    </div>

    <!-- MENU -->
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <i class="pi pi-home"></i>
        <span>{{ t('menu.dashboard') }}</span>
      </router-link>

      <router-link to="/my-combos" class="nav-item" active-class="active">
        <i class="pi pi-box"></i>
        <span>{{ t('menu.myCombos') }}</span>
      </router-link>

      <router-link to="/new-project" class="nav-item" active-class="active">
        <i class="pi pi-shopping-bag"></i>
        <span>{{ t('menu.newProject') }}</span>
      </router-link>

      <router-link to="/support" class="nav-item" active-class="active">
        <i class="pi pi-question-circle"></i>
        <span>{{ t('menu.support') }}</span>
      </router-link>

      <router-link to="/notifications" class="nav-item" active-class="active">
        <i class="pi pi-inbox"></i>
        <span>{{ t('notifications.title') }}</span>
      </router-link>

      <router-link to="/projects" class="nav-item" active-class="active">
        <i class="pi pi-briefcase"></i>
        <span>{{ t('menu.projects') }}</span>
      </router-link>

      <router-link to="/payment" class="nav-item" active-class="active">
        <i class="pi pi-credit-card"></i>
        <span>{{ t('menu.payment') }}</span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <i class="pi pi-user"></i>
        <span>{{ t('menu.profile') }}</span>
      </router-link>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <pv-select-button v-model="locale" :options="availableLocales" />

      <button class="logout-btn" @click="logout">
        <i class="pi pi-sign-out"></i>
        <span>{{ t('menu.logout') }}</span>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useUserStore } from "@/IAM/application/user.store.js";

const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const userStore = useUserStore();

function logout() {
  localStorage.removeItem("currentUser");
  userStore.logout?.();
  router.push("/login");
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0;
  background: linear-gradient(180deg, #f76c6c 0%, #e74c3c 100%);
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
}

/* LOGO */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 1.2rem;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff;
}

.logo-img {
  width: 34px;
  height: 34px;
}

.logo-text {
  letter-spacing: 1px;
}

/* NAV */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0.8rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  transition: all 0.25s ease;
}

.nav-item i {
  font-size: 1.1rem;
  min-width: 20px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(4px);
}

.active {
  background: rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

/* FOOTER */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

/* LOGOUT */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* PRIME */
.p-togglebutton {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
