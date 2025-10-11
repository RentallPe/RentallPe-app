<template>
  <div class="register-wrapper">
    <div class="register-card">
      <!-- Logo -->
      <div class="logo">
        <i class="pi pi-map-marker text-danger text-3xl"></i>
        <h1 class="logo-text">RENTALPE</h1>
      </div>

      <!-- Formulario -->
      <div class="p-fluid">
        <div class="field">
          <label for="fullName">Nombre</label>
          <pv-input-text id="fullName" v-model="form.fullName" placeholder="Tu nombre completo" />
        </div>

        <div class="field">
          <label for="email">Correo Electrónico</label>
          <pv-input-text id="email" v-model="form.email" placeholder="ejemplo@correo.com" />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <pv-password id="password" v-model="form.password" toggleMask feedback="false" />
        </div>

        <div class="field">
          <label for="confirmPassword">Repetir contraseña</label>
          <pv-password id="confirmPassword" v-model="form.confirmPassword" toggleMask feedback="false" />
        </div>

        <pv-button
            label="Registrar"
            class="register-button mt-3"
            @click="registerUser"
        />

        <div class="login-link">
          <router-link to="/login">Log In</router-link> | <a href="#">¿Olvidó su contraseña?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const form = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
});

async function registerUser() {
  if (!form.value.fullName || !form.value.email || !form.value.password) {
    alert("Por favor completa todos los campos.");
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const newUser = {
    fullName: form.value.fullName,
    email: form.value.email,
    password: form.value.password,
    phone: "",
    createdAt: new Date().toISOString(),
    photo: "",
    paymentMethods: []
  };

  try {
    await axios.post("http://localhost:3000/users", newUser);
    alert("Usuario registrado con éxito");
    router.push("/login");
  } catch (err) {
    console.error("Error registrando usuario:", err);
    alert("No se pudo registrar el usuario");
  }
}
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
}
.register-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.logo {
  text-align: center;
  margin-bottom: 1.5rem;
}
.logo-text {
  color: #f76c6c;
  font-weight: bold;
  font-size: 1.5rem;
}
.register-button {
  width: 100%;
  background-color: #f76c6c;
  border: none;
}
.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
.login-link a {
  color: #f76c6c;
  text-decoration: none;
}
</style>