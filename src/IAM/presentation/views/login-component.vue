<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="/src/assets/logo-rentalpe.png" alt="RentalPe Logo" class="logo" />
      <h2 class="brand">RENTALPE</h2>

      <input v-model="email" type="email" :placeholder="t('login.email')" class="form-control" />
      <input v-model="password" type="password" :placeholder="t('login.password')" class="form-control" />

      <button class="btn btn-login" @click="loginUser">
        {{ t('login.login') }}
      </button>

      <p class="text-muted mt-3">
        <a @click="$router.push('/register')" class="link">
          {{ t('login.register') }}
        </a> |
        <a href="#" class="link">
          {{ t('login.forgotPassword') }}
        </a>
      </p>

      <!-- Botón para cambiar idioma -->
      <div class="mt-3">
        <button class="btn btn-lang" @click="toggleLang">
          🌐 {{ currentLocale.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useUserStore} from "@/IAM/application/user.store.js"
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'

const {t, locale} = useI18n()

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

const currentLocale = ref(locale.value)

function toggleLang() {
  // alternar entre 'es' y 'en'
  locale.value = locale.value === 'es' ? 'en' : 'es'
  currentLocale.value = locale.value
}

async function loginUser() {
  await userStore.fetchUsers()
  const users = userStore.users ?? []

  const user = users.find(
      u => u.email.trim().toLowerCase() === email.value.trim().toLowerCase() &&
          u.password.trim() === password.value.trim()
  )

  if (user) {
    alert(`Bienvenido ${user.fullName}`)
    localStorage.setItem("currentUser", JSON.stringify(user))
    userStore.setUser(user)
    router.push("/dashboard")
  } else {
    alert("Correo o contraseña incorrectos")
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
}

.auth-box {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 350px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100px;
  margin-bottom: 10px;
}

.brand {
  color: #ff7070;
  font-weight: bold;
  letter-spacing: 2px;
}

.form-control {
  margin: 8px 0;
  border: 1px solid #ff7070;
  border-radius: 20px;
  padding: 10px;
  width: 100%;
  text-align: center;
}

.btn-login {
  background: #ff7070;
  color: white;
  border: none;
  width: 100%;
  border-radius: 20px;
  padding: 10px;
  font-weight: bold;
}

.btn-lang {
  background: #1f1f1f;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-lang:hover {
  background: #333;
}

.link {
  color: #ff7070;
  cursor: pointer;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>