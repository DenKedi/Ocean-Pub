import { createApp } from 'vue'
import './assets/styles/style.css'
import './assets/styles/themes.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './stores/themeStore.js'
import { useAuth } from './stores/authStore.js'

// Theme System initialisieren
initTheme()

// Auth-Status aus localStorage wiederherstellen
const { init: initAuth } = useAuth()
initAuth()

createApp(App).use(router).mount('#app')
