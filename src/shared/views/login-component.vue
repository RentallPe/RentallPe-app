<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="/src/public/logo-rentalpe.png" alt="RentalPe Logo" class="logo" />
      <h2 class="brand">RENTALPE</h2>

      <input v-model="email" type="email" placeholder="correo electrónico" class="form-control" />
      <input v-model="password" type="password" placeholder="contraseña" class="form-control" />

      <button class="btn btn-login" @click="loginUser">Ingresar</button>

      <p class="text-muted mt-3">
        <a @click="$router.push('/register')" class="link">Registrarse</a> |
        <a href="#" class="link">¿olvidó su contraseña?</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRentalStore } from "@/Rental/application/rental-store.js"
import { useUserStore } from "@/stores/user"
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'

const email = ref('')
const password = ref('')
const rentalStore = useRentalStore()
const userStore = useUserStore()
const router = useRouter()

async function loginUser() {
  await rentalStore.fetchAll('users')
  await nextTick()
  const users = rentalStore.list('users').value ?? []


  console.log("Usuarios cargados en login:", users)

  const user = users.find(
      u => u.email.trim().toLowerCase() === email.value.trim().toLowerCase() &&
          u.password.trim() === password.value.trim()
  )


  if (user) {
    alert(`Bienvenido ${user.fullName}`)

    // Guardar en localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Guardar en Pinia
    userStore.setUser(user)

    // Redirigir según rol
    if (user.role === 'provider') {
      router.push("/dashboard") // o la ruta inicial de proveedor
    } else {
      router.push("/dashboard") // o la ruta inicial de cliente
    }
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

.btn-login {
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
.auth-container {
  background-color: #ffffff;
}
</style>
