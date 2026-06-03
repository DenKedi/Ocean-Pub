<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from './composables/useThemeStore.js'
import { useAuth } from './composables/useAuth.js'

const { initTheme } = useThemeStore()

onMounted(() => {
  initTheme()
  const { init: initAuth } = useAuth()
  initAuth()
})
</script>

<template>
  <RouterView />
</template>
