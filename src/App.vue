<template>
  <main>
    <the-sidebar v-if="showSidebar" />
    <router-view />
  </main>
</template>

<script setup>
import TheSidebar from '@/public/Sidebar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const showSidebar = computed(() => {
  return !['/login', '/register'].includes(route.path)
})
</script>

<style scoped>
body, #app {
  font-family: 'Roboto Flex', sans-serif;
}
</style>