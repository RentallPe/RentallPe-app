<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="/src/assets/logo-rentalpe.png" alt="RentalPe Logo" class="logo" />
      <h2 class="brand">RENTALPE</h2>

      <input v-model="fullName" :placeholder="t('register.fullName')" class="form-control" />
      <input v-model="email" type="email" :placeholder="t('register.email')" class="form-control" />
      <input v-model="password" type="password" :placeholder="t('register.password')" class="form-control" />
      <input v-model="repeatPassword" type="password" :placeholder="t('register.repeatPassword')" class="form-control" />

      <select v-model="role" class="form-control">
        <option disabled value="">{{ t('register.selectRole') }}</option>
        <option value="customer">{{ t('roles.customer') }}</option>
        <option value="provider">{{ t('roles.provider') }}</option>
      </select>

      <button class="btn btn-register" @click="registerUser">
        {{ t('register.register') }}
      </button>

      <p class="text-muted mt-3">
        <a @click="$router.push('/login')" class="link">
          {{ t('register.login') }}
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
import {useRouter} from "vue-router"
import {useUserStore} from "@/IAM/application/user.store.js"
import {useProviderStore} from "@/Provider/application/provider-store.js"
import {useI18n} from 'vue-i18n'

const {t, locale} = useI18n()
const router = useRouter()
const userStore = useUserStore()
const providerStore = useProviderStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const role = ref('')

const currentLocale = ref(locale.value)

function toggleLang() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  currentLocale.value = locale.value
}

async function registerUser() {
  if (password.value !== repeatPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const newUser = {
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    phone: "",
    role: role.value,
    providerId: null,
    photo: "https://randomuser.me/api/portraits/men/75.jpg"
  };



  try {
    const user = await userStore.registerUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(user))
    userStore.setUser(user)
    alert("Registro exitoso, bienvenido " + user.fullName)
    router.push("/dashboard")
  } catch (error) {
    console.error(error)
    alert("Error al registrar el usuario")
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

.btn-register {
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