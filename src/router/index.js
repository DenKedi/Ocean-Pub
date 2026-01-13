import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import StoriesPage from '../views/StoriesPage.vue'
import EventsPage from '../views/EventsPage.vue'
import ParallaxPage from '../views/ParallaxPage.vue'
import DrinksPage from '../views/DrinksPage.vue'
import FriendsPage from '../views/FriendsPage.vue'
import RequestPage from '../views/RequestPage.vue'
import ImpressumPage from '../components/pages/ImpressumPage.vue'
import DatenschutzPage from '../components/pages/DatenschutzPage.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/stories',
    name: 'Stories',
    component: StoriesPage
  },
  {
    path: '/events',
    name: 'Events', 
    component: EventsPage
  },
  {
    path: '/parallax',
    name: 'Parallax',
    component: ParallaxPage
  },
  {
    path: '/drinks',
    name: 'Drinks',
    component: DrinksPage
  },
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsPage
  },
  {
    path: '/request',
    name: 'Request',
    component: RequestPage
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
  },
  // Admin Routes
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  // Catch-all redirect to home for non-existent pages
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
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

// Navigation Guard für geschützte Routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ path: '/admin', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router