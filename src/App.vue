<template>
  <main>
    <the-sidebar></the-sidebar>
    <router-view></router-view>
  </main>
</template>
<script setup>
import TheSidebar from '@/public/Sidebar.vue'

</script>

<style scoped>
body, #app {
  font-family: 'Roboto Flex', sans-serif;

}

</style>
