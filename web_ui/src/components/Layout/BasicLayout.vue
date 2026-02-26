<template>
  <a-watermark :content="appTitle"
    :alpha="0.1"
    :rotate="-22"
    :anti-tamper="true">
    <a-layout id="main" class="basic-layout">
      <Navbar />
      <a-layout>
        <a-layout-content class="basic-layout-content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-watermark>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from './Navbar.vue'

const appTitle = computed(() => {
  const ip = window.location.hostname
  return `${import.meta.env.VITE_APP_COPYRIGHT || 'Power By Rachel Design'}@${ip}`
})
</script>

<style scoped>
.basic-layout-content {
  background: var(--color-bg-base);
  padding: 0;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>
