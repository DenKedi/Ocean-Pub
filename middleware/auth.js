export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return

  const token = localStorage.getItem('token')
  if (!token) {
    return navigateTo(`/admin?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
