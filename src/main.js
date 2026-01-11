import { createApp } from 'vue'
import './assets/styles/style.css'
import './assets/styles/themes.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './stores/themeStore.js'

// Theme System initialisieren
initTheme()

createApp(App).use(router).mount('#app')
