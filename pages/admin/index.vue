<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'

const router = useRouter()
const { state, login, isLoggedIn } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  // Wenn bereits eingeloggt, zum Dashboard weiterleiten
  if (isLoggedIn()) {
    router.push('/admin/dashboard')
  }
})

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Bitte E-Mail und Passwort eingeben'
    return
  }

  loading.value = true
  error.value = ''

  const result = await login(email.value, password.value)
  
  loading.value = false

  if (result.success) {
    router.push('/admin/dashboard')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h1>Admin Login</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@ocean-bar.de"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Passwort</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Anmeldung...</span>
          <span v-else>Anmelden</span>
        </button>
      </form>

      <div class="login-footer">
        <RouterLink to="/">← Zurück zur Website</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #EAF6FB 0%, #FBF3E4 60%, #d4edec 100%);
  padding: 2rem;
}

.login-container {
  background: #ffffff;
  border: 1.5px solid rgba(22, 58, 78, 0.12);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 40px rgba(22, 58, 78, 0.12);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: var(--beach-navy, #163A4E);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: rgba(22, 58, 78, 0.6);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(22, 58, 78, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
}

.form-group input {
  background: var(--beach-sand, #FBF3E4);
  border: 1.5px solid rgba(22, 58, 78, 0.15);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  color: var(--beach-navy, #163A4E);
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input::placeholder {
  color: rgba(22, 58, 78, 0.4);
}

.form-group input:focus {
  outline: none;
  border-color: var(--beach-ocean, #2A7FA5);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(42, 127, 165, 0.12);
}

.error-message {
  background: rgba(232, 97, 77, 0.1);
  border: 1.5px solid rgba(232, 97, 77, 0.35);
  color: var(--beach-coral, #E8614D);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
}

.login-btn {
  background: var(--beach-coral, #E8614D);
  color: #fff !important;
  border: none;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.login-btn:hover:not(:disabled) {
  background: #d44f3c;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 97, 77, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-footer a {
  color: rgba(22, 58, 78, 0.55);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.login-footer a:hover {
  color: var(--beach-ocean, #2A7FA5);
}
</style>
