import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../../pages/index.vue'),
  },
  {
    path: '/events',
    component: () => import('../../pages/events.vue'),
  },
  {
    path: '/drinks',
    component: () => import('../../pages/drinks.vue'),
  },
  {
    path: '/request',
    component: () => import('../../pages/request.vue'),
  },
  {
    path: '/impressum',
    component: () => import('../../pages/impressum.vue'),
  },
  {
    path: '/datenschutz',
    component: () => import('../../pages/datenschutz.vue'),
  },
  {
    path: '/admin',
    component: () => import('../../pages/admin/index.vue'),
  },
  {
    path: '/admin/dashboard',
    component: () => import('../../pages/admin/dashboard.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Auth guard (replaces middleware/auth.js)
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return { path: '/admin', query: { redirect: to.fullPath } }
    }
  }
})

export default router
