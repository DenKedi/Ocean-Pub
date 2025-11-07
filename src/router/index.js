import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import EventsPage from '../views/EventsPage.vue'
import ImpressumPage from '../components/pages/ImpressumPage.vue'
import DatenschutzPage from '../components/pages/DatenschutzPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/events',
    name: 'Events', 
    component: EventsPage
  },
  {
    path: '/impressum',
    name: 'Impressum',
    component: ImpressumPage
  },
  {
    path: '/datenschutz',
    name: 'Datenschutz',
    component: DatenschutzPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

export default router