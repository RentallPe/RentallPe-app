<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-text">RentallPe</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <i class="pi pi-home"></i>
        <span>{{ t('menu.dashboard') }}</span>
      </router-link>

      <router-link to="/my-combos" class="nav-item" active-class="active">
        <i class="pi pi-box"></i>
        <span>{{ t('menu.myCombos') }}</span>
      </router-link>

      <!-- 👇 Nuevo menú para ver la tienda -->
      <router-link to="/new-project" class="nav-item" active-class="active">
        <i class="pi pi-shopping-bag"></i>
        <span>{{ t('menu.store') }}</span>
      </router-link>

      <router-link to="/support" class="nav-item" active-class="active">
        <i class="pi pi-question-circle"></i>
        <span>{{ t('menu.support') }}</span>
      </router-link>

      <router-link to="/alerts" class="nav-item" active-class="active">
        <i class="pi pi-bell"></i>
        <span>{{ t('menu.alerts') }}</span>
      </router-link>

      <router-link to="/payment" class="nav-item" active-class="active">
        <i class="pi pi-credit-card"></i>
        <span>{{ t('menu.payment') }}</span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <i class="pi pi-user"></i>
        <span>{{ t('menu.profile') }}</span>
      </router-link>

      <div class="sidebar-footer">
        <pv-select-button v-model="locale" :options="availableLocales" />
        <button class="logout-btn" @click="logout">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
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
  wwidth: 230px;
  background-color: #f76c6c;
  color: #000;
  height: 100vh;
  display: flex;
  padding: 1.5rem 0;
  position: fixed;
  align-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0 1rem;
}

.logo-img {
  width: 28px;
  height: 28px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: black;
  font-weight: 500;
  transition: background 0.2s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.active {
  background-color: rgba(0, 0, 0, 0.1);
}

.sidebar-footer {
  display: flex;
  justify-content: space-evenly;
  padding: 1rem 0;
  font-size: 1.2rem;
}
.p-togglebutton {
  background: #a14949;
}
</style>
