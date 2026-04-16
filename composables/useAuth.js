import { reactive } from 'vue'

const state = reactive({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
})

export const useAuth = () => {
  const api = useApi()

  async function init() {
    if (!import.meta.client) return
    const token = localStorage.getItem('token')
    if (token) {
      try {
        state.loading = true
        const { data } = await api.get('/users/me')
        state.user = data
        state.isAuthenticated = true
      } catch {
        localStorage.removeItem('token')
        state.user = null
        state.isAuthenticated = false
      } finally {
        state.loading = false
      }
    }
  }

  async function login(email, password) {
    try {
      state.loading = true
      state.error = null

      const { data } = await api.post('/users/login', { email, password })
      localStorage.setItem('token', data.token)

      const userResponse = await api.get('/users/me')
      state.user = userResponse.data
      state.isAuthenticated = true

      return { success: true }
    } catch (err) {
      state.error = err.response?.data?.msg || 'Login fehlgeschlagen'
      return { success: false, error: state.error }
    } finally {
      state.loading = false
    }
  }

  function logout() {
    if (import.meta.client) {
      localStorage.removeItem('token')
    }
    state.user = null
    state.isAuthenticated = false
    state.error = null
  }

  function isLoggedIn() {
    if (!import.meta.client) return false
    return state.isAuthenticated || !!localStorage.getItem('token')
  }

  return { state, init, login, logout, isLoggedIn }
}
