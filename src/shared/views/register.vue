<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="/src/public/logo-rentalpe.png" alt="RentalPe Logo" class="logo" />
      <h2 class="brand">RENTALPE</h2>

      <input v-model="fullName" placeholder="Nombre" class="form-control" />
      <input v-model="email" type="email" placeholder="Correo Electrónico" class="form-control" />
      <input v-model="password" type="password" placeholder="Contraseña" class="form-control" />
      <input v-model="repeatPassword" type="password" placeholder="Repetir contraseña" class="form-control" />

      <button class="btn btn-register" @click="registerUser">Registrar</button>

      <p class="text-muted mt-3">
        <a @click="$router.push('/login')" class="link">Log In</a> |
        <a href="#" class="link">¿Olvido su contraseña?</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRentalStore} from "@/Rental/application/rental-store.js";
import { useRouter } from "vue-router";
const router = useRouter();


const fullName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const rentalStore = useRentalStore()

async function registerUser() {
  if (password.value !== repeatPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    phone: "",
    createdAt: new Date().toISOString()
  };

  try {
    const user = await rentalStore.create("users", newUser);
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Registro exitoso, bienvenido " + user.fullName);
    router.push("/dashboard"); // 👈 redirige al dashboard
  } catch (error) {
    alert("Error al registrar el usuario");
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
