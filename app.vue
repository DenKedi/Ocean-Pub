<script setup>
// Theme System initialisieren
const { initTheme } = useThemeStore()

if (import.meta.client) {
  initTheme()

  // Auth-Status aus localStorage wiederherstellen
  const { init: initAuth } = useAuth()
  initAuth()
}
</script>

<template>
  <NuxtPage />
</template>
