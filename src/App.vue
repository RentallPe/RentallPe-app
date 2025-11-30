<template>
  <main>
    <SidebarCustomer v-if="showSidebar && user.role === 'customer'" />
    <SidebarProvider v-if="showSidebar && user.role === 'provider'" />
    <router-view />
  </main>
</template>



<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/IAM/application/user.store.js'
import SidebarCustomer from '@/shared/views/components/Sidebar.vue'
import SidebarProvider from '@/shared/views/components/SidebarProvider.vue'

const route = useRoute()
const user = useUserStore()

const showSidebar = computed(() => {
  return !['/login', '/register'].includes(route.path)
})
const userStore = useUserStore()
const savedUser = localStorage.getItem("currentUser")
if (savedUser) {
  userStore.setUser(JSON.parse(savedUser))
}

</script>

<style scoped>
body, #app {
  font-family: 'Roboto Flex', sans-serif;
}
</style>