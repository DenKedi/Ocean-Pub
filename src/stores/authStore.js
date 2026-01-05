import { reactive } from 'vue'
import api from '@/utils/api'

/**
 * Auth Store - Verwaltet den Authentifizierungsstatus
 */
const state = reactive({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

/**
 * Initialisiert den Auth-Status beim App-Start
 */
async function init() {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      state.loading = true
      const { data } = await api.get('/users/me')
      state.user = data
      state.isAuthenticated = true
    } catch (err) {
      localStorage.removeItem('token')
      state.user = null
      state.isAuthenticated = false
    } finally {
      state.loading = false
    }
  }
}

/**
 * Login mit Email und Passwort
 */
async function login(email, password) {
  try {
    state.loading = true
    state.error = null
    
    const { data } = await api.post('/users/login', { email, password })
    localStorage.setItem('token', data.token)
    
    // User-Daten laden
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

/**
 * Logout
 */
function logout() {
  localStorage.removeItem('token')
  state.user = null
  state.isAuthenticated = false
  state.error = null
}

/**
 * Prüft ob User eingeloggt ist
 */
function isLoggedIn() {
  return state.isAuthenticated || !!localStorage.getItem('token')
}

export const useAuth = () => ({
  state,
  init,
  login,
  logout,
  isLoggedIn
})

export default { state, init, login, logout, isLoggedIn }
