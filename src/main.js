import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '../app.vue'
import router from './router/index.js'
import '../assets/styles/style.css'
import '../assets/styles/themes.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
