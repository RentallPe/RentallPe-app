<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="/src/assets/logo-rentalpe.png" alt="RentalPe Logo" class="logo" />
      <h2 class="brand">RENTALPE</h2>

      <input v-model="fullName" placeholder="Nombre" class="form-control" />
      <input v-model="email" type="email" placeholder="Correo Electrónico" class="form-control" />
      <input v-model="password" type="password" placeholder="Contraseña" class="form-control" />
      <input v-model="repeatPassword" type="password" placeholder="Repetir contraseña" class="form-control" />

      <!-- Selector de rol -->
      <select v-model="role" class="form-control">
        <option disabled value="">Selecciona tu rol</option>
        <option value="customer">Cliente</option>
        <option value="provider">Proveedor</option>
      </select>

      <button class="btn btn-register" @click="registerUser">Registrar</button>

      <p class="text-muted mt-3">
        <a @click="$router.push('/login')" class="link">Log In</a> |
        <a href="#" class="link">¿olvidó su contraseña?</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { useUserStore } from "@/IAM/application/user.store.js"
import { useProviderStore } from "@/Provider/application/provider-store.js"

const router = useRouter()
const userStore = useUserStore()
const providerStore = useProviderStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const role = ref('')

async function registerUser() {
  if (password.value !== repeatPassword.value) {
    alert("Las contraseñas no coinciden")
    return
  }

  if (!role.value) {
    alert("Debes seleccionar si eres Cliente o Proveedor")
    return
  }

  let providerId = null

  if (role.value === "provider") {
    // Crear nuevo provider
    const newProvider = {
      id: Date.now(),
      name: fullName.value,
      contact: email.value
    }

    try {
      const createdProvider = await providerStore.createProvider(newProvider)
      providerId = createdProvider.id
    } catch (error) {
      alert("Error al crear el proveedor")
      return
    }
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    phone: "",
    createdAt: new Date().toISOString(),
    role: role.value,
    providerId // solo si es provider
  }

  try {
    const user = await userStore.createUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(user))
    userStore.setUser(user) // guardar en Pinia

    alert("Registro exitoso, bienvenido " + user.fullName)

    router.push("/dashboard")
  } catch (error) {
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
  background: #1f1f1f;
}

.auth-box {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 350px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
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

.link {
  color: #ff7070;
  cursor: pointer;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}


.auth-container[data-v-a58de6a7] {
  background-color: #ffffff;
}
</style>

