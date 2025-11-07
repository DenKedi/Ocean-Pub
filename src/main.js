import { createApp } from 'vue'
import './style.css'
import './assets/themes.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './stores/themeStore.js'

// Theme System initialisieren
initTheme()

createApp(App).use(router).mount('#app')
